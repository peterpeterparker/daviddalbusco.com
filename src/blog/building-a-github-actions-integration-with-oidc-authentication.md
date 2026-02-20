---
path: "/blog/building-a-github-actions-integration-with-oidc-authentication"
date: "2026-02-24"
title: Building a GitHub Actions Integration with OIDC Authentication
description: "How I replaced GitHub Secrets with short-lived tokens for deploying with GitHub Actions."
tags: "#github-actions #oidc #cicd #rust #javascript #deployment #authentication #security"
image: "https://daviddalbusco.com/assets/images/maxim-berg-ANuuRuCRRAc-unsplash.jpg"
---

---

I rarely take the time to step back after releasing a new feature on Juno. I generally build, build, build, ship, and repeat — forgetting to breathe. On top of that, writing long blog posts often feels like a relative waste of time, as they rarely find their audience. Nonetheless, for once, I thought I'd take a moment to write about what I released yesterday: deploying frontends or publishing serverless functions on Juno from GitHub Actions using ephemeral access keys granted through an OpenID Connect flow.

The following is a walkthrough of the solution. I'll go through the various steps required to implement such a workflow and highlight the pieces I feel are important.

It won't be a tutorial, nor something you or your AI can — or should — copy-paste to implement a similar outcome. But hopefully it contains something interesting — or at least leads someone to reach out for suggestions of improvements.

---

## How It Works

Authenticating CI/CD pipelines without long-lived secrets is not a new concept and, even though I kind of randomly learned about it, GitHub Actions has been supporting OpenID Connect for a while now.

The idea is simple: instead of storing a secret that can leak, rotate, or be forgotten, the CI generates a short-lived token — a JWT that proves *where* the workflow is running: which repository, which branch, which actor.

The twist is that the other end is not a typical server. The satellite is a Rust WASM container running on the Internet Computer, where you cannot simply store sensitive secrets and call it a day. The verification has to be done properly, and entirely on the blockchain.

That's what makes the implementation a bit particular, and why the flow ultimately goes through quite a few steps and assertions.

To give you an idea, the diagram below summarizes the flow, from the moment a GitHub Actions workflow is triggered to the moment the ephemeral access key is approved for use.

[DIAGRAM]

Before any deployment happens, the Actions workflow generates an identity — a key-pair, a nonce, and their corresponding salt. It then exchanges the nonce with GitHub's API to obtain a signed JWT that also contains information about the repository, actor, and workflow.

This JWT, along with the salt, is sent to the satellite using the generated identity. An identity is essentially a private-public key pair.

On the satellite side, the JWT header is decoded first to identify the provider ("is it GitHub calling?"), then the public keys are retrieved — either from cache or from Observatory, Juno's public infrastructure, which runs a cronjob to keep those keys fresh.

From there, the satellite runs a series of verifications: the JWK signature and timestamps, the salt to prevent man-in-the-middle attacks, the claims to confirm the request comes from the configured repository, and finally the JTI to prevent replay attacks.

If everything passes, the identity is saved as an allowed access key and the workflow can proceed with the deployment.

From there it's standard Juno usage — the GitHub Action uploads a file, and the access key is validated to approve or reject the operation. I won't cover that part here, there are already enough steps as it is 😅.

---

## The GitHub Action

The entry point of the integration is a bash script. Nothing fancy, it checks which command is being run, decides whether authentication is needed, and if so, generates an ephemeral token before passing it to the CLI.

```bash
JUNO_TOKEN=$(node /kit/token/src/authenticate.ts "$@")
echo "::add-mask::$JUNO_TOKEN"
export JUNO_TOKEN
```

Two things worth noting here:

1. The generated token is passed as `JUNO_TOKEN`, the same environment variable the CLI already supports. No changes were needed in the CLI itself, which was a nice side effect of the approach.
2. `::add-mask::` ensures the token never appears in the Actions logs, even accidentally. We do not want to leak the private key in some logs...

From there, a custom script within the action takes over. I like abstraction, so rather than implementing the authentication flow directly, it delegates to `@junobuild/auth` — a library I maintain — through a single function call: `authenticateAutomation`.

```typescript
const {identity} = await authenticateAutomation({
  github: {
    credentials: {
      generateJwt
    },
    automation: {
      satellite: {
        container,
        satelliteId
      }
    }
  }
});
```

The library doesn't know anything about GitHub. It just knows it needs a JWT and will ask for one by calling the `generateJwt` callback. This means the action is responsible for implementing that callback: taking the nonce, calling GitHub's token endpoint, and returning the signed JWT.

```typescript
const generateJwt = async ({nonce}: {nonce: string}) => {
  const response = await fetch(`${process.env.ACTIONS_ID_TOKEN_REQUEST_URL}&audience=${nonce}`, {
    headers: {
      Authorization: `Bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`,
      Accept: 'application/json; api-version=2.0',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Could not retrieve token');
  }

  const {value: oidcToken} = await response.json();
  return {jwt: oidcToken};
};
```

You may notice `audience=${nonce}` in the URL. This is a workaround: GitHub does not allow customizing any fields of the JWT aside from the `aud` (audience) claim. So I use that field, which is not really meant for this purpose, to pass the nonce along.

`process.env.ACTIONS_ID_TOKEN_REQUEST_URL` and `process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN` are environment variables that GitHub automatically injects into the workflow, but only if the workflow declares `id-token: write` permissions.

That `nonce` passed to the callback is generated by the library itself before calling back, and it is not purely random. It is derived from a SHA-256 hash of a salt and the identity's principal (basically a public key), encoded as a base64 URL string.

```typescript
const generateSalt = (): Salt => crypto.getRandomValues(new Uint8Array(32));

const buildNonce = async ({salt, caller}: {salt: Salt; caller: Ed25519KeyIdentity}) => {
  const principal = caller.getPrincipal().toUint8Array();

  const bytes = new Uint8Array(salt.length + principal.byteLength);
  bytes.set(salt);
  bytes.set(principal, salt.length);

  const hash = await crypto.subtle.digest('SHA-256', bytes);

  return toBase64URL(arrayBufferToUint8Array(hash));
};
```

This matters because the satellite will later reconstruct the nonce from the same inputs and verify it matches, which is what prevents man-in-the-middle attacks.

> Note that `caller` is our identity, our access key. I use the three interchangeably here.

Once the JWT is obtained, it is sent to the satellite along with the salt, using the generated identity as the caller.

```typescript
const result = await authenticateAutomationApi({
  args: {
    OpenId: {
      jwt,
      salt
    }
  },
  actorParams: {
    automation,
    identity: caller
  }
});
```

If the satellite approves, the identity is returned as the ephemeral access key, serialized and passed back to the CLI as `JUNO_TOKEN`.

Later on, a cleanup step, registered as a trap on exit of the entry script, takes care of removing the access key from the satellite once the workflow is done.

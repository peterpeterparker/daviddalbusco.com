---
path: "/blog/hack-the-world-computers"
date: "2025-11-27"
title: Hack the World (Computer)
description: "How I used a CSP loophole to rescue trapped ICP tokens from a web app"
tags: "#javascript #webdev #security #internetcomputer #icp #typescript #esbuild #webworkers"
image: "https://daviddalbusco.com/assets/images/1*I8hVM9GzLEmHtVsAr2G4zA.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*I8hVM9GzLEmHtVsAr2G4zA.jpeg)

> Photo by [Markus Spiske](https://unsplash.com/fr/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/photo-du-film-matrix-iar-afB0QQw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

**TLDR**: I obviously did not hack anything but, I may have found a creative way to inject and run code in a web app to resolve an issue. So here's a little story...

---

## The Context

On the World Computer, or the [Internet Computer](https://internetcomputer.org/), a public decentralized network which runs WASM containers that can serve web applications and sites, anytime you sign-in in an app you get a session (identity) that is identified by an anonymous non-trackable unique ID (principal, basically a public key) which happens to be a wallet address as well.

In other words, it means that wherever you authenticate, you basically get each time kind of an IBAN number which can - or not - be used to hold money, crypto ICP in that case.

That's an interesting pattern and challenge as you might end up having assets a bit everywhere - though nowadays the integration of well known wallets such as [OISY](https://oisy.com/) and established standards limits a bit the "issue".

However, particularly if you do not pay attention or if the app you are using does not offer a great UI/UX, you might send some money to the wrong address. As for example if you copied your address x but thought you had copied your address y.

This isn't a problem per se unless you send ICP to an incorrect address (that you control) but finds place in an app that does not offer possibilities to get the money out.

---

## The Problem

So a few days ago a friend was facing exactly this situation. He was staring at a situation where he'd potentially lost money with no way to get it out.

He started looking for help and asked if anyone had an idea how to work around this.

---

## The Memory

Since I've been active in the community for a few years, it turned out this wasn't my first rodeo. Few years ago, I'd actually developed a script after one or two beers 😅 at like midnight to help someone in the community resolving a similar issue as soon as possible. I exactly remember writing it in my hotel room while attending the [WeAreDevelopers](https://www.wearedevelopers.com/) conference to give a workshop about [Juno](https://juno.build).

The idea of the workaround is pretty straightforward: leverage the browser's debugger to run a script in the console after the user has signed in. This script loads the session (identity) the same way the app itself does, then initializes and executes functions that aren't actually implemented by the app.

But I wasn't sure if that "hack" was still working, so first I had to try it.

---

## First Attempt: Blocked by CSP

I opened the website (as good hobbyist hacker here I obviously keep its name obfuscated) and launched my import:

```javascript
const { transfer } = await import("https://unpkg.com/yolosns@latest/dist/esm/index.js");
```

Unfortunately, or fortunately if you like me rather like security, this did not work out as it was blocked by the CSP:

```
VM50:1 Loading the script 'https://unpkg.com/yolosns@latest/dist/esm/index.js' violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'". Note that 'script-src-elem' was not explicitly set, so 'script-src' is used as a fallback. The action has been blocked.
Uncaught TypeError: Failed to fetch dynamically imported module: https://unpkg.com/yolosns@latest/dist/esm/index.js
```

![A screenshot of the import blocked by the CSP in the browser console debugger](https://daviddalbusco.com/assets/images/1*7dev_oxGbi42GNjlwg9r_g.png)

At this point I was about to share that it couldn't work but, then I told myself, wait have a second look.

---

## The Loophole

I opened the elements, found no CSP defined there, then checked the network tab and figured out those were nicely set using HTTP headers in the response:

```
default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; connect-src 'self' https://icp-api.io https://ic0.app https://icp0.io https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; style-src 'self' 'unsafe-inline'; media-src 'self' data: blob:; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

From a quick look, everything seemed tight but, then I noticed something. The `worker-src`, I assume the app is using web workers, is accepting `blob:`.

It hit me and I asked myself: but wait, can I actually create a web worker on the fly and run it?

I started to search how you can create a web worker from a blob and found the solution on [Stack Overflow](https://stackoverflow.com/a/61621269/5404186).

I gave it a try and it worked out, the console log was executed:

```javascript
const code = "console.log('Hello from web worker!')";
const blob = new Blob([code], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));
```

At this point I knew it was possible to inject a script but, I still had to figure out how to inject one that actually does something and how to create the blob.

I was also aware that creating the blob with a plain text would (maybe) be tricky or not that handy, just thinking at dealing with the quotes was already a no go in my mind.

---

## Building the Solution

I didn't have to search too long. I'd recently developed a new feature for Juno's CLI: `juno run`

It's a command that runs arbitrary scripts in the CLI context. Super handy for running anything, and it even works in GitHub Actions - but I'm getting off track, that's for another blog post.

Anyway, it works similarly. The CLI compiles the script using `esbuild`, converts the output from `Uint8Array` to `base64`, and executes it using an `await import`.

Pretty much the same technique.

So I started working on the solution. First, I created a test script - the one I wanted to inject and run:

```javascript
console.log("Yolo");
```

Then I created a build script to compile the code and prepare it for manual transport into the browser.

I started with the esbuild part. I use [esbuild](https://esbuild.github.io/) everywhere, big fan, I basically just had to copy/paste my own recipe:

```javascript
const { outputFiles } = await esbuild.build({
	entryPoints: ["src/transfer.ts"],
	write: false,
	bundle: true,
	minify: true,
	splitting: false,
	treeShaking: false,
	format: "esm",
	define: { global: "window" },
	target: ["esnext"],
	platform: "browser",
	conditions: ["worker", "browser"]
});

const code = outputFiles?.[0]?.contents;
```

I set `write` to `false` to not generate the output into a file and no `splitting` or `treeshaking` as I'm looking for a single JS file. I use esm because, well, it's 2025 and add a `conditions` worker. Don't remember from where I got that, but I knew and know it works.

Esbuild provides back an object which contains the code as `Uint8Array`.

Copying/pasting an array is inconvenient, plain string as I said would be not handy so I converted the code to `base64`:

```javascript
const base64 = Buffer.from(code).toString(`base64`);
```

Finally I wrote the output to a plain file because printing to the terminal the final solution likely would be too long:

```javascript
writeFileSync(join(process.cwd(), "script.txt"), base64);
```

Great potato script but, does the job. Run against my test script I got:

```
Y29uc29sZS5sb2coIllvbG8iKTsK
```

How cute.

---

## Testing the Flow

So I reloaded the web app and tested the complete flow with my base64-encoded test script:

```javascript
const code = "Y29uc29sZS5sb2coIllvbG8iKTsK";
const uint8Array = Uint8Array.fromBase64(code);
const blob = new Blob([uint8Array], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));
```

![A screenshot of the step successfully run in the Chrome browser debugger](https://daviddalbusco.com/assets/images/1*61rGpu9ntwL3sImWmD880w.png)

Hooray that did the trick!!! The console logged "Yolo". 🥳

---

## The Transfer Script

From there, it was just typical Internet Computer code as you would do in an app.

First, a script to create an authentication client - i.e. a client that reads the session key:

```typescript
import { AuthClient } from "@icp-sdk/auth/client";

const createAuthClient = (): Promise<AuthClient> =>
	AuthClient.create({
		idleOptions: {
			disableIdle: true,
			disableDefaultIdleCallback: true
		}
	});
```

Then creating what we call an agent - a transport layer that takes care of executing queries and calls for you using the session and a specified network, in this case mainnet:

```typescript
import { AuthClient } from "@icp-sdk/auth/client";
import { HttpAgent } from "@icp-sdk/core/agent";
import { Principal } from "@icp-sdk/core/principal";

const createClient = async (): Promise<{
	agent: HttpAgent;
	user: Principal;
}> => {
	const authClient = await createAuthClient();

	const agent = await HttpAgent.create({
		host: "https://icp-api.io",
		identity: authClient.getIdentity()
	});

	return {
		agent,
		user: authClient.getIdentity().getPrincipal()
	};
};
```

And finally putting together the function that effectively calls the ICP ledger for the session - basically the operation that tells the ledger to transfer the money somewhere else:

```typescript
import { IcrcLedgerCanister } from "@icp-sdk/canisters/ledger/icrc";

const transfer = async ({
	ledgerCanisterId,
	owner,
	amount,
	fee
}: {
	ledgerCanisterId: string;
	owner: string;
	amount: bigint;
	fee?: bigint;
}) => {
	const { agent } = await createClient();

	const { transfer } = IcrcLedgerCanister.create({
		agent,
		canisterId: Principal.fromText(ledgerCanisterId)
	});

	await transfer({
		to: { owner: Principal.fromText(owner), subaccount: [] },
		amount,
		fee
	});
};
```

I've done that zillion times so it took me likely less than a minute to set up. Ultimately, I ended the script with the effective usage wrapped as a function because I think I couldn't execute an asynchronous call at the root of the worker:

```javascript
console.log("************** Hello transfer ****************");

(async () => {
	await transfer({
		ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
		owner: "DESTINATION_ACCOUNT_PRINCIPAL",
		amount: 1234n
	});
})();
```

And voilà. I committed everything in a repo and sent it to my friend, telling him he should edit the script with the address he would like to retrieve his funds to and then provided the step by step instruction and he got his money back. ✅

---

I'm definitely not a hacker and this ain't a hack but, it definitely felt like I was one! 😃

Hope you found the little story entertaining. Until next time.

David

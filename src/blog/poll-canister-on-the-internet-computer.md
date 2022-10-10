---
path: "/blog/poll-canister-on-the-ic-with-web-workers"
date: "2022-10-10"
title: "Poll canister on the Internet Computer"
description: "Repeatedly calls a function on the IC with web workers without decreasing your dapp frontend performance."
tags: "#javascript #internetcomputer #programming #webdev"
image: "https://images.unsplash.com/photo-1524678714210-9917a6c619c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxMHx8dGltZXJ8ZW58MHx8fHwxNjY1MjIzNjYx&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/poll-canister-on-the-internet-computer"
---

![Blue clock on a pastel background](https://images.unsplash.com/photo-1524678714210-9917a6c619c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxMHx8dGltZXJ8ZW58MHx8fHwxNjY1MjIzNjYx&ixlib=rb-1.2.1&q=80&w=1080)

*Photo by [Icons8 Team](https://unsplash.com/@icons8?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Some use cases require frontend dapp to repeatedly calls a function deployed on the [Internet Computer](https://internetcomputer.org/) with a fixed time delay between each call. e.g. in [Papyrs](https://papy.rs) - a web3 blogging platform - there is no save button. Each edit users are making is automatically saved in the backend.

Likewise, some other application might require information to be pushed from a server rather than being queried. e.g. using web socket to implement a chat. However, such type of protocol or feature is not yet supported by canister smart contracts.

Commonly I solve these two problems by creating cronjob that runs in my frontend dapp - i.e. in the browser.

While not all such functions might decrease the performance of the UI, I like to be precautious about it. That is why I always defer the job of these schedulers to [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

In this article, I will show you how you can implement such a solution too.

* * *

## Web workers?

If you are not familiar with web workers you might ask yourself what it is. I advice you to have a look to the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for all the details but, in few words, web workers are a simple way to run scripts in the background threads of the browser.

They can run JavaScript and perform HTTP calls but, they cannot access the localstorage nor modify the DOM directly. e.g. you cannot modify a state in a web worker and expect the UI to be re-rendered automatically. UI (window) and workers are separated. You can picture this a bit like the separation caused by embedding an iframe.

* * *

## Introduction

The solution I aim to display defers the work from the UI to web workers. When the application starts, it initializes and starts the polling which take care of querying the IC repeatedly. Ultimately, to render the results in the UI, the backend threads transfer the data to the window of the browser.

![https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1665226130679.webp?token=kr6uPPnKwLhWMNrU_ycNK](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1665226130679.webp?token=kr6uPPnKwLhWMNrU_ycNK)

The tutorial covers therefore following steps:

1.  Set up and start a web worker
2.  Use [agent-js](https://github.com/dfinity/agent-js/) in the worker to get the identity
3.  Call the IC
4.  Transfer the results to the UI

* * *

## 1. Set up a web worker

For this tutorial I will use vanilla JavaScript because when you create a new sample application with `dfx` or `npm init ic`, the outcome is a barebone frontend app.

But, I have got your back 😄. I am a HUGE fan of web workers and I published various tutorials that show how to set up these for various frameworks.

*   [SvelteKit](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/sveltekit-web-worker)
*   [Angular](https://daviddalbusco.com/blog/angular-and-web-workers/)
*   [Stencil](https://daviddalbusco.com/blog/stenciljs-and-web-worker-a-fairy-tale/)

*I also got a post about the integration in [React](https://daviddalbusco.com/blog/react-and-web-workers/) but, it is a bit outdated. If you use Webpack, better follow this article.*

So, assuming you have also initialized a sample application to follow this tutorial, we can start by creating the worker in a new file. e.g. `src/myapp\_frontend/src/worker.js`.

```javascript
self.onmessage = async ($event) => {
    console.log("Worker message", $event);
};
```

In above snippet and at this point, the worker just listens for messages and print these to the console.

On the UI side, we declare two elements. A `button` to sign in with [Internet Identity](https://identity.ic0.app/) and a `textarea` use ultimately to render the results we are polling.

```html
<main>
    <button type="button">Sign in</button>

    <textarea />
</main>
```

We do not absolutely need to sign in to query the IC with web workers or generally speaking but, it is probably a common use case. That is why this post showcases it as well.

Once the HTML document has been completely parsed, we attach a `click` event to the button that performs a sign in with II.

```javascript
import { AuthClient } from "@dfinity/auth-client";

const signIn = async () => {
  const authClient = await AuthClient.create();
  await authClient.login({
    onSuccess: async () => console.log(await authClient.isAuthenticated()),
    onError: (err) => console.log(err),
    identityProvider: `http://r7inp-6aaaa-aaaaa-aaabq-cai.localhost:8000?#authorize`,
  });
};

const initSignInButton = () => {
  const button = document.querySelector("button");
  button.addEventListener("click", signIn, { passive: true });
};

const init = () => {
  initSignInButton();
};

document.addEventListener("DOMContentLoaded", init);
```

To set up and start the worker, we add an additional function that creates a `Worker` object, declares a listener used to receive the results and post a message from the UI to the worker to start the polling.

```javascript
const startWorker = () => {
  const worker = 
    new Worker(new URL('./worker.js', import.meta.url));

  worker.onmessage = ($event) => {
    console.log("Window message", $event);
  };

  worker.postMessage({msg: 'start'});
};

const init = () => {
  startWorker();
  initSignInButton();
};
```

If we deploy the solution to a local simulated network, we should be able to sign in and when the dapp starts, the worker should print the "start" message.

![capture-d%E2%80%99e%CC%81cran-2022-10-08-a%CC%80-13.29.22.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-10-08-a%CC%80-13.29.22.png?token=PDzwmLoijNmdCbHsGBhHk)

* * *

## 2. Use agent-js in the worker to get the identity

I like to provide both a "start" and "stop" options when I implement this type of cronjob. In this particular example we won't use the "stop" feature but, it can be particularly useful when the worker is created from a component. It can be used to stop the timer when the component gets unmounted.

```javascript
let timer;

self.onmessage = async ({ data }) => {
  const { msg } = data;

  switch (msg) {
    case "start":
      start();
      break;
    case stop:
      stop();
  }
};

const stop = () => clearInterval(timer);

const start = () => (timer = setInterval(call, 2000));

const call = async () => {
  // TODO: call the IC
}
```

The "start" method instantiates a `setInterval` which will repeatedly call the function that queries the IC. In this particular function, we create an authentication client with agent-js to retrieve the identity of the user if signed in.

While the initialization look similar to what we commonly do on the UI side (kudos to [Sea Snake](https://forum.dfinity.org/u/sea-snake) for the inputs about it on [Discord](https://discord.com/invite/cA7y6ezyE2)), it is important to note that the "idle manager" feature of the client must be disabled. This feature detects users' inactivity by observing `window` events. The web worker not being able to read such object, not disabling these capabilities would lead to errors.

```javascript
const call = async () => {
  // Disable idle manager because web worker cannot access the window object of the UI
  const authClient = await AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true,
    },
  });

  const isAuthenticated = await authClient.isAuthenticated();

  if (!isAuthenticated) {
    // User is not authenticated
    return;
  }

  const identity = authClient.getIdentity();

  // TODO: call the IC
};
```

* * *

## 3. Call the IC

Because of the same limitation as in previous chapter, we have to provide a `host` information to create an actor that calls the backend. Moreover, because the declarations automatically generated by dfx contain a default actor that is only designed to work on the UI side, we have to copy the function that initializes an actor - and the canister ID constant - within our worker or in a dedicated file.

```javascript
// Copy from auto generated declarations

const canisterId = process.env.ICWEBWORKER_BACKEND_CANISTER_ID;

export const createActor = (canisterId, options) => {
  const agent = new HttpAgent(options ? { ...options.agentOptions } : {});

  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...(options ? options.actorOptions : {}),
  });
};
```

Once copied, we instantiate the actor and effectively perform the call.

```javascript
const query = async ({ identity }) => {
  const actor = createActor(canisterId, {
    agentOptions: { identity, 
      host: `http://${canisterId}.localhost:8000/` 
    },
  });
  const greeting = await actor.greet();

  // TODO: transfer results to UI
};
```

To load the web worker in the browser and to fetch the root key in development, we have to access the local server and provide the host with the canister ID as a subdomain (not query parameter).

For production, the host parameter can be replaced with `https://ic0.app`. This works out regardless of your frontend and backend effective URLs.

Not strictly related to this solution, here is the backend code that gets called - i.e. the `greet` function I implemented for demo purpose.

```javascript
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

actor {
  stable var counter = 0;

  public shared({caller}) func greet() : async Text {
    counter += 1;

    return "Hello, " # Principal.toText(caller) # ". Counter: " # Nat.toText(counter);
  };
};

```

It is a simple update method that increments a counter and returns "Hello", the caller principal ID as text and the incremented value.

* * *

## 4. Transfer the results to the UI

Now that we have obtained data from the IC, we can apply these to re-render the UI. As the worker itself cannot do so, we transfer the data to the view with the help of [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage).

```javascript
const query = async ({ identity }) => {
  const actor = createActor(canisterId, {
    agentOptions: { identity, 
      host: `http://${canisterId}.localhost:8000/` },
  });
  const greeting = await actor.greet();

  // Transfer data worker -> window / UI
  postMessage({ msg: "result", greeting });
};
```

In the first chapter we have already declared a listener for the messages received from the worker. Therefore, to finalize the solution, we process the data and update the DOM.

```javascript
// In index.js - in the view
worker.onmessage = ({data}) => {
    const {msg, greeting} = data;

    switch (msg) {
        case 'result':
        document
          .querySelector("textarea").value 
            += `${greeting}\n`;
    }
};
```

Above code snippet appends the data - the results provided by the worker, the data returned by the backend - to a textarea. If we deploy to a local simulated IC and open the dapp in a browser, we should notice text being added to the element every two seconds.

![icwebworker.gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/icwebworker.gif?token=ydvGykqt737dhu_kPIuQV)

* * *

## Summary

Thanks to web worker we can poll the Internet Computer without compromising on the frontend performance of our dapp. I ❤️ it.

You will find this solution in a sample repo I shared on GitHub 👉 [https://github.com/peterpeterparker/icwebworker](https://github.com/peterpeterparker/icwebworker)

To infinity and beyond  
David

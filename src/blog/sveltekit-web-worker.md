---
path: "/blog/sveltekit-web-worker"
date: "2022-07-07"
title: "SvelteKit Web Worker"
description: "How to create and communicate with a web worker in SvelteKit and ViteJS"
tags: "#javascript #svelte #vitejs #programming"
image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw1fHxjb25zdHJ1Y3Rpb258ZW58MHx8fHwxNjU2ODcwOTM0&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://daviddalbusco.medium.com/sveltekit-web-worker-8cfc0c86abf6"
---
![In the line of fire](https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw1fHxjb25zdHJ1Y3Rpb258ZW58MHx8fHwxNjU2ODcwOTM0&ixlib=rb-1.2.1&q=80&w=1080)

*Photo by [Christopher Burns](https://unsplash.com/@christopher__burns?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I ❤️ [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)!

These background threads are my go to strategy to compute anything I consider as too expensive for a frontend web application (e.g. [Tie Tracker](https://tietracker.com)) or if it has to execute a recurring tasks (e.g. [Papyrs](https://papy.rs/) or [Cycles.watch](https://cycles.watch/)).

In these two last projects, I used [SvelteKit](https://kit.svelte.dev/). So here is how you can develop and communicate with web workers using such an application framework.

* * *

## Create a web worker

There is no particular requirements nor convention but I like to suffix my worker files with the extension `.worker.ts` - e.g. to create a bare minimum worker I create a file named `my.worker.ts` which finds place in the `src/lib` directory.

```typescript
onmessage = () => {
  console.log('Hello World 👋');
};

export {};
```

[onmessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/message_event) is a function that fires each time the web worker gets called - i.e. each time [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) is used to send a message to the worker from the window side.

![excalidraw-1657189373053.webp](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1657189373053.webp?token=jFxecJ-Kl7eZ35n00rXn7)

The empty `export {}` is a handy way to make the worker a module and solve following TypeScript error if not declared:

*TS1208: 'my.worker.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.*

* * *

## Dynamically import

To integrate the worker in a component it needs to be dynamically imported. SvelteKit relying on [ViteJS](https://vitejs.dev/) for its tooling, it can be imported with the `?worker` suffix (see [documentation](https://vitejs.dev/guide/assets.html#importing-script-as-a-worker)).

```typescript
<script lang="ts">
  import { onMount } from 'svelte';

  let syncWorker: Worker | undefined = undefined;

  const loadWorker = async () => {
    const SyncWorker = await import('$lib/my.worker?worker');
    syncWorker = new SyncWorker.default();
  };

  onMount(loadWorker);
</script>

<h1>Web worker demo</h1>
```

In above snippet I affect the worker to a local variable in case I would like to use it elsewhere in the component. Notably on `onDestroy` callback if I would clean up or propagate the destruction to the worker.

* * *

## PostMessage: window -> web worker

To send a message from the window side to the web worker we need a reference to the loaded module. For such purpose we can use the variable I declared in previous chapter. e.g. we can send an empty message - empty object - right after the initialization.

```typescript
const loadWorker = async () => {
  const SyncWorker = await import('$lib/my.worker?worker');
  syncWorker = new SyncWorker.default();

  syncWorker.postMessage({});
};
```

Assuming everything goes according plan, the web worker should receive the message and log to the console the "Hello World 👋".

![capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.00.02.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.00.02.png?token=543zp2yH5rX5JO9Pr4rD1)

*If you face the issue "SyntaxError: import declarations may only appear at top level of a module" while following this article, note that the use of web workers in development is only supported in selected browsers (see issue [#4586](https://github.com/vitejs/vite/issues/4586) in ViteJS).*

* * *

## PostMessage: web worker -> window

Messages are bidirectional - i.e. web worker can also send messages to the window side. To do so, `postMessage` is used as well. The only difference with previous transmission channel is that it does not need an object or module as reference to trigger the message.

```typescript
onmessage = () => {
  console.log('Hello World 👋');

  postMessage({});
};

export {};

```

In above snippet I send an empty message object from the web worker to the window each time the worker receives a messages (#yolo).

To intercept these messages on the window side, a function that fires every time such messages are send need to be registered. The loaded worker exposes an `onmessage` property for such purpose.

```typescript
<script lang="ts">
  import { onMount } from 'svelte';

  let syncWorker: Worker | undefined = undefined;

  const onWorkerMessage = () => {
      console.log('Cool it works out 😃');
  };

  const loadWorker = async () => {
    const SyncWorker = await import('$lib/my.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    syncWorker.postMessage({});
  };

  onMount(loadWorker);
</script>
```

If I refresh my test browser and console, previous message "Hello World 👋" is still printed but, in addition, the new message "Cool it works out 😃" is added to the console as well.

![capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.08.51.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.08.51.png?token=pD5YWfMeq6HE4w7BttQs9)

* * *

## TypeScript

Sending empty messages is cute for demo purpose but you might want to define some TypeScript definition to improve the code.

What I generally do is defining some types for the requests and responses that are identified with a typed identificator and contains information next to them. e.g. I often use a variable named `msg` and a `data` object that effectively contains the information.

```typescript
export interface PostMessageDataRequest {
  text: string;
}

export interface PostMessageDataResponse {
  text: string;
}

export type PostMessageRequest = 'request1' | 'start' | 'stop';
export type PostMessageResponse = 'response1' | 'response2';

export interface PostMessage<T extends PostMessageDataRequest | PostMessageDataResponse> {
  msg: PostMessageRequest | PostMessageResponse;
  data?: T;
}
```

Again here, no particular reason or best practice, just a thing I do to clean up my code 😄.

Thanks to these definitions, I can now set types for the `onmessage` function of the web worker.

```typescript
import type { PostMessage, PostMessageDataRequest } from './post-message';

onmessage = ({ data: { data, msg } }: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  console.log(msg, data);

  const message: PostMessage<PostMessageDataRequest> = {
    msg: 'response1',
    data: { text: 'Cool it works out v2 🥳' }
  };
  postMessage(message);
};

export {};

```

Likewise, types can be defined in the component.

```typescript
<script lang="ts">
  import { onMount } from 'svelte';
  import type {
    PostMessage,
    PostMessageDataRequest,
    PostMessageDataResponse
  } from '../lib/post-message';

  let syncWorker: Worker | undefined = undefined;

  const onWorkerMessage = ({
    data: { msg, data }
  }: MessageEvent<PostMessage<PostMessageDataResponse>>) => {
    console.log(msg, data);
  };

  const loadWorker = async () => {
    const SyncWorker = await import('$lib/my.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.onmessage = onWorkerMessage;

    const message: PostMessage<PostMessageDataRequest> = {
      msg: 'request1',
      data: { text: 'Hello World v2 🤪' }
    };
    syncWorker.postMessage(message);
  };

  onMount(loadWorker);
</script>
```

As I now use objects and modified the information that are transmitted, the messages printed in the console of my browser now reflects these changes.

![capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.35.26.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.35.26.png?token=3DZJGZAuyYVLopkbbx8zn)

* * *

## Cronjob

As mentioned in the introduction, I use web worker to execute recurring tasks - to schedule cronjob. e.g in [Papyrs](https//papyrs.rs), I use web worker jobs to synchronize the content of the blog posts that are edited and saved on the client side with the [Internet Computer](https://internetcomputer.org/). Thanks to this approach, the user gets a smooth experience as the UI is not affected by any network communication.

When I implement such a timer in a web worker, I always define "start" and "stop" functions. The first being called when the web worker is loaded on the window side and the second being called when the related component that uses it gets destroyed.

```typescript
import type { PostMessage, PostMessageDataRequest } from './post-message';

onmessage = ({ data: { msg } }: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
  switch (msg) {
    case 'start':
      startTimer();
      break;
    case 'stop':
      stopTimer();
  }
};

let timer: NodeJS.Timeout | undefined = undefined;

const print = () => console.log(`Timer ${performance.now()}ms ⏱`);

const startTimer = () => (timer = setInterval(print, 1000));

const stopTimer = () => {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = undefined;
};

export {};
```

To schedule the time I use [setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) which repeatedly calls a function or executes a code snippet, with a fixed time delay between each call. In above example, it log to the console every second.

On the window side, I use `postMessage` again to trigger the two events.

```typescript
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  let syncWorker: Worker | undefined = undefined;

  const loadWorker = async () => {
    const SyncWorker = await import('$lib/my.worker?worker');
    syncWorker = new SyncWorker.default();

    syncWorker.postMessage({ msg: 'start' });
  };

  onMount(loadWorker);

  onDestroy(() => syncWorker?.postMessage({ msg: 'stop' }));
</script>
```

After updating my browser one last time, I find out `console.log` that are effectively printed according the interval I defined in my web worker.

![capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.46.53.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-07-07-a%CC%80-13.46.53.png?token=zYQauEtmynxix3lqVml0C)

* * *

## Conclusion

Web worker are pure coding joy to me 🤓.

To infinity and beyond  
David

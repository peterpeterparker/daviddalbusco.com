---
path: "/blog/a-frameworkless-store-in-typescript"
date: "2022-05-02"
title: "A Frameworkless Store In TypeScript"
description: "Have you ever developed applications that have their API, services and state management fully separated from their core?"
tags: "#typescript #javascript #webdev #programming"
image: "https://images.unsplash.com/photo-1508004680771-708b02aabdc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyfHxmcmFtZXxlbnwwfHx8fDE2NTA3MTEwOTQ&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://daviddalbusco.medium.com/call-internet-computer-canister-smart-contracts-in-nodejs-ce1d495d95ce"
---

![San Francisco 1.4](https://images.unsplash.com/photo-1508004680771-708b02aabdc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwyfHxmcmFtZXxlbnwwfHx8fDE2NTA3MTEwOTQ&ixlib=rb-1.2.1&q=80&w=1080)

_Photo by [pine watt](https://unsplash.com/@pinewatt?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

There are undeniable advantages to using frameworks (React, Angular, Svelte etc.) for frontend development but there are also undeniable disadvantages.

The interoperability and compatibility between projects across various technologies is often an issue that has to be anticipated for long-lasting applications and for corporates that share resources among teams.

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) - a suite of different technologies allowing you to create reusable agnostic custom elements - is a common key to the challenge. However, their usage is often limited to the creation of design systems or rich UI components.

According my experience, few companies explicitly enforce the separation of the presentation layers from the business layers in their frontend apps.

In all honesty, have you often developed applications that have the API and services layers fully separated from your projects? Did you ever extracted the state management of your applications to reusable libraries?

This is what I was looking to solve when I developed [Papyrs](https://papy.rs) - an open-source, privacy-first, decentralized blogging platform that lives 100% on chain.

---

## Abstract

In this blog post I present an architecture that separate business and state management logic for two applications developed with two different technologies ([Sveltekit](https://kit.svelte.dev/) and [Stencil](https://stenciljs.com/)).

After what I display the effective frameworkless code of the store I developed in TypeScript and how it can be integrated in these two apps.

---

## Architecture

Papyrs is a spin-off project of [DeckDeckGo](https://deckdeckgo.com). Both are web editors that should save and publish data on [DFINITY](https://dfinity.org/)'s Internet Computer - i.e. their goals are different but their architectures should be the same.

Because DeckDeckGo was migrated last year - not yet live - to the Internet Computer while remaining backwards compatible with [Google Firebase](https://firebase.google.com), it was already designed to support various providers. The API layer was already implemented in distinctive libraries.

However, when I started the implementation of Papyrs, the business logic and the state management were still implemented within the DeckDeckGo's application.

I had therefore to ask myself if I was eager to reimplement these features from scratch (😅) or if any other solution - such as reusing and sharing libraries - would be a solid option.

![untitled-2022-02-07-1330(2).png](<https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/untitled-2022-02-07-1330(2).png?token=dzH5gUzX0QgiPJ2wS4p3s>)

As you reading this article, I assume you know what was the outcome: I have extracted and separated the features to reuse the exact same code in the two projects 😄.

While extracting the business logic was a relatively straight forward operation - mostly stateless functions - extracting the store was a bit more tricky.

Fortunately I ultimately found a solution - the one I share in next chapters - which mixes an agnostic writable state management and readable stores.

Basically, the stores of the library take care of holding the states while the applications replicate these values to update the UI.

![untitled-2022-02-07-1330(3).png](<https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/untitled-2022-02-07-1330(3).png?token=Af2JN1SZulvWHW28hVmn7>)

---

## Frameworkless code

The store is nothing less than a generic `class` which contains a value and exposes `set` and `get` functions.

```typescript
export class Store<T> {
	constructor(private value: T) {}

	set(value: T) {
		this.value = value;
	}

	get(): T {
		return this.value;
	}
}
```

The store should also propagate the changes - a consumer should be made aware when a value is modified. Therefore it should provide a way to register callbacks.

In addition, when a consumer register a listener, it should also be able to stop listening for changes - i.e. to unregister the callback.

That's why the store assign a unique ID to each callback that gets registered. Thanks to these identifier, it is possible to return a function that can unsubscribe the listener.

To generate unique identifier I use [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) - a browsers' built-in object whose constructor returns a `symbol` that's guaranteed to be unique.

The `subscribe` function also calls the callback that gets registered. That way, the consumer receives instantly the current value without having to wait for the next update.
Finally, the setter `propagate` the new value to all callbacks that are registered.

```typescript
interface StoreCallback<T> {
	id: Symbol;
	callback: (data: T) => void;
}

export class Store<T> {
	private callbacks: StoreCallback<T>[] = [];

	constructor(private value: T) {}

	set(value: T) {
		this.value = value;

		this.propagate(value);
	}

	get(): T {
		return this.value;
	}

	private propagate(data: T) {
		this.callbacks.forEach(({ callback }: StoreCallback<T>) => callback(data));
	}

	subscribe(callback: (data: T) => void): () => void {
		const callbackId: Symbol = Symbol();

		this.callbacks.push({ id: callbackId, callback });

		callback(this.value);

		return () =>
			(this.callbacks = this.callbacks.filter(({ id }: StoreCallback<T>) => id !== callbackId));
	}
}
```

---

## Demo

To give a try to the above generic state management, we can create a dummy store and a consumer.

---

## Store

Following store contains an object `Doc` initialized with `null`.

```typescript
import { Store } from "./store";

export interface Doc {
	title: string;
}

export const docStore: Store<Doc | null> = new Store<Doc | null>(null);
```

---

### Consumer

The consumer - a test script - creates two subscribers, set a first value "hello", unsubscribe the first listener and set a new value "world".

```typescript
import { docStore, type Doc } from "./doc.store";

const print = ({ subscriber, value }: { subscriber: string; value: Doc | null }) =>
	console.log(`${subscriber}:`, value);

const unsubscribe1 = docStore.subscribe((value: Doc | null) =>
	print({ subscriber: "Subscribe #1", value })
);
const unsubscribe2 = docStore.subscribe((value: Doc | null) =>
	print({ subscriber: "Subscribe #2", value })
);

docStore.set({ title: "hello" });
console.log("Get:", docStore.get());

unsubscribe1();

docStore.set({ title: "world" });
console.log("Get:", docStore.get());
```

---

### Test

If we run the above script in a terminal we shall notice the following:

- the subscribers get the current value instantly
- the first subscriber is successfully unregistered
- the store retains the value and triggers the subscribers that are registered

We can conclude everything works as expected 🥳.

![capture-d%E2%80%99e%CC%81cran-2022-04-28-a%CC%80-09.33.11.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-04-28-a%CC%80-09.33.11.png?token=XOC8HnN1mH9s5yNOX64l6)

---

## Packaging

I was seeking to fully isolate the business logic from my applications. If the stores would have been made fully accessible by the libraries that contains them, the applications would have been able to write values.
To solve this requirement, my libraries only expose the interfaces and subscribers of the stores.

```typescript
export { type Doc } from "./doc.store";

export const docSubscribe = (callback: (doc: Doc | null) => void): (() => void) =>
	docStore.subscribe(callback);
```

---

## Usage

The above solution is agnostic. It is written in TypeScript and is compiled to JavaScript. That is why it can be integrated in any modern frameworks or even without 😁.

---

### Svelte

[Readable stores](https://svelte.dev/tutorial/readable-stores) is an interesting pattern that is provided by Svelte out of the box. The store of the library introduced in previous chapters can be scoped within a function that can write to a store of the application but that cannot be called anywhere else.

```typescript
import { docSubscribe, type Doc } from "state-mgmt";
import { readable } from "svelte/store";

const start = (set: (value: Doc | null) => void) => {
	const unsubscriber: () => void = docSubscribe((doc: Doc | null) => set(doc));

	return function stop() {
		unsubscriber();
	};
};

export const doc = readable<Doc | null>(null, start);
```

Each time the library set a value in the state management, the subscriber is called and the current value is replicated to the Svelte store. Ultimately the UI is updated.

---

### Stencil

The [@stencil/store](https://github.com/ionic-team/stencil-store) out of the box is writable. Fortunately - thanks to a solution shared by Philipp Mudra on the Stencil's slack channel - it can be made readonly with a TypeScript [utility](https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype).

```typescript
import { createStore } from "@stencil/store";
import { docSubscribe, type Doc } from "state-mgmt";

interface DocStore {
	doc: Doc | null;
}

const { state } = createStore<DocStore>({ doc: null });

docSubscribe((doc: Doc | null) => {
	state.doc = doc;
});

const readonlyState: Readonly<typeof state> = state;

export default { state: readonlyState };
```

---

## Conclusion

In my opinion, it is kind of cool to have the all business logic and state management fully disconnected from the application.

If one of these days I wanted to develop a new UI for [Papyrs](https://papy.rs), I would be able to do so quickly and without worrying about any logic.

In addition, the solution is scalable. I can reuse and replicate the same approach over and over again until I have got no more idea of new applications to develop on web3 😜.

To infinity and beyond  
David

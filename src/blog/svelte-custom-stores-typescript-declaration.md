---
path: "/blog/svelte-custom-stores-typescript-declaration"
date: "2023-01-20"
title: "Svelte Custom Stores TypeScript Declaration"
description: "Svelte offers some nice easy-to-use store concepts. One of those is the "custom store" but how to declare its types?"
tags: "#typescript #svelte #programming #webdevelopment"
image: "https://images.unsplash.com/photo-1537237858032-3ad1b513cbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwzM3x8YWJzdHJhY3R8ZW58MHx8fHwxNjc0MjAyMzA5&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://medium.com/@daviddalbusco/svelte-custom-stores-typescript-declaration-db34c0f7e7b8"
---

![https://unsplash.com/photos/azCTGObXR14](https://images.unsplash.com/photo-1537237858032-3ad1b513cbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwzM3x8YWJzdHJhY3R8ZW58MHx8fHwxNjc0MjAyMzA5&ixlib=rb-4.0.3&q=80&w=1080)

*Photo by [JJ Ying](https://unsplash.com/@jjying?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Svelte offers some nice easy-to-use store concepts. One of those is "[custom stores](https://svelte.dev/tutorial/custom-stores)" which makes handy the obfuscation of the reactive stored data and its access through a set of custom defined functions.

e.g. for a counter that counts apples and bananas, I can create a custom store that does not expose directly my data. Within a function, I can "hide" the store and expose only the functions I want to use in my apps instead of exposing publicly `set` and `update`. This to avoid misbehavior and unexpected changes, what can be really useful as the code base grows.

```typescript
import { writable } from 'svelte/store';

export interface Counter {
	apples: number;
	bananas: number;
}

const initStore = () => {
	const initialCounter: Counter = {
		apples: 0,
		bananas: 0
	};

	const { subscribe, set, update } =
		writable(initialCounter);

	return {
		subscribe,
		incBanana: () =>
			update(({ bananas, ...rest }) => ({
				...rest,
				bananas: bananas + 1
			})),
		decBanana: () =>
			update(({ bananas, ...rest }) => ({
				...rest,
				bananas: bananas - 1
			})),
		reset: () => set(initialCounter)
	};
};

export const counter = initStore();
```

Above code snippet follows Svelte's documentation example with the addition of a type - `Counter` - for the object saved in my store and few custom functions - `incBanana`, `decBanana` and `reset`.

*Note that I just did not implement the "apples" related functions to keep the snippet small. In a real use case I might have even extracted the `update()` part to a function to avoid double code but, I also skipped this part because it would have not much value in this blog post context.*

When bind in a component, it works as expected.

![counter.gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/counter.gif?token=zL0w-s4NX-jmjm6Oc6Ci3)

However, even if `npm run dev|build|check` are all fine, Webstorm is not being able to derive the store values when used in a TypeScript `script` block.

![capture-d%E2%80%99e%CC%81cran-2023-01-20-a%CC%80-10.31.09.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2023-01-20-a%CC%80-10.31.09.png?token=ptBGQR8Uj4TMUJPSCei7Z)

I do not know exactly if it is yet another issue of the Jetbrains Svelte plugin or if the store is derived as `any` type by the bundler (which would ignore the `strict` option 🤷‍♂️). Nevertheless, I rather like to fix the issue by improving the type declaration of the store.

Because my custom store exposes my home made functions but, also the root `subscribe` feature, its declaration has to providing support for it as well.

Therefore the most easy way in my opinion is to inherits the existing `Readable` type of Svelte.

```typescript
import {type Readable} from 'svelte/store';

export interface AuthStore extends Readable<Counter> {
	incBanana: () => void;
	decBanana: () => void;
	reset: () => void;
}
```

By setting the generic types to my custom data type - `Counter` - I can instruct which type is handled in the store and by declaring my functions, I can improve the typings.

I can use this new interface to set the return type of the initialization function - `initStore` - and that's already it.

```typescript
import { type Readable, writable } from 'svelte/store';

export interface Counter {
	apples: number;
	bananas: number;
}

export interface AuthStore extends Readable<Counter> {
	incBanana: () => void;
	decBanana: () => void;
	reset: () => void;
}

const initStore = (): AuthStore => {
	const initialCounter: Counter = {
		apples: 0,
		bananas: 0
	};

	const { subscribe, set, update } =
		writable(initialCounter);

	return {
		subscribe,
		incBanana: () =>
			update(({ bananas, ...rest }) => ({
				...rest,
				bananas: bananas + 1
			})),
		decBanana: () =>
			update(({ bananas, ...rest }) => ({
				...rest,
				bananas: bananas - 1
			})),
		reset: () => set(initialCounter)
	};
};

export const counter = initStore();
```

When I open my component, I notice that Webstorm now understands correctly the type of my data.

![capture-d%E2%80%99e%CC%81cran-2023-01-20-a%CC%80-10.42.55.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2023-01-20-a%CC%80-10.42.55.png?token=JvVSu9s4WjDS7Eyq0YxE2)

To infinity and beyond  
David
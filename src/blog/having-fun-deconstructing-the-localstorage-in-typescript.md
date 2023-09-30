---
path: "/blog/having-fun-deconstructing-the-localstorage-in-typescript"
date: "2022-09-01"
title: "Having fun deconstructing the localstorage in TypeScript 🤙"
description: "Read stringified objects from the localstorage in TypeScript using fun stuffs such as deconstructing objects, assertion and generic"
tags: "#typescript #webdev #showdev #programming"
image: "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw5N3x8c3RvcmFnZXxlbnwwfHx8fDE2NjIwMjQyOTQ&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://daviddalbusco.medium.com/having-fun-deconstructing-the-localstorage-in-typescript-e5e99d95aa13"
---

![https://unsplash.com/photos/koyy-5uzlPU](https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw5N3x8c3RvcmFnZXxlbnwwfHx8fDE2NjIwMjQyOTQ&ixlib=rb-1.2.1&q=80&w=1080)

_Photo by [Katya Ross](https://unsplash.com/@katya?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I recently implemented some features with the [localstorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). While I always had read values using the [getItem()](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem) method of the interface, I replaced this approach in my recent work with deconstruction of the storage object.

For no particular reason. I just like to deconstruct things, a lot 😄.

---

## Old school

Back in the days - until last few weeks 😉 - I would have probably implemented a function to read a stringified `object` from the storage as following:

```typescript
type MyType = unknown;

const isValid = (value: string | null): value is string => [null, undefined, ""].includes(value);

const oldSchool = (): MyType | undefined => {
	const value: string | null = localStorage.getItem("my_key");

	if (!isValid(value)) {
		return undefined;
	}

	return JSON.parse(value);
};
```

i.e. I would have first get the `string` value (stringified `JSON.stringify()` representation of the object I would have saved in the storage) using `getItem()` before double checking its validity and parsing it back to an object.

---

## New school

While I nowadays keep following previous logic ("read, check validity and parse"), I am now deconstructing the storage to read the value.

```typescript
const newSchool = (): MyType | undefined => {
	const { my_key: value }: Storage = localStorage;

	if (!isValid(value)) {
		return undefined;
	}

	return JSON.parse(value);
};
```

Again, no particular reason but, isn't it shinier? 👨‍🎨

This approach is possible in TypeScript because the `Storage` interface - representing the [Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) - is actually declared as a map of keys of `any` types.

```typescript
interface Storage {
	readonly length: number;
	clear(): void;
	getItem(key: string): string | null;
	key(index: number): string | null;
	removeItem(key: string): void;
	setItem(key: string, value: string): void;
	// HERE 😃 [name: string]: any;
	[name: string]: any;
}
```

---

## SSR & pre-rendering

The `localstorage` is a readonly property of the `window` interface - i.e. it exists only in the browser. To prevent my SvelteKit's static build to crash when I use it, I set an `undefined` fallback value for the NodeJS context.

Moreover, as in addition to the deconstruction pattern, I also like to inline everything (😄). So, I came up with the following code snippet to solve my inspiration:

```typescript
import { browser } from "$app/env";

const newSchool = (): MyType | undefined => {
	const { my_key: value }: Storage = browser
		? localStorage
		: ({ my_key: undefined } as unknown as Storage);

	if (!isValid(value)) {
		return undefined;
	}

	return JSON.parse(value);
};
```

---

## Generic

At this point you might say "Yes David, good, this is cool and stuffs but, what about reusability?". To which, I would answer "Hold my beer, you can dynamically deconstruct objects" 😉.

```typescript
const newSchool = <T>(key: string): T | undefined => {
	const { [key]: value }: Storage = browser
		? localStorage
		: ({ [key]: undefined } as unknown as Storage);

	if (!isValid(value)) {
		return undefined;
	}

	return JSON.parse(value);
};
```

---

## Summary

Returning `undefined` is convenient for demo purpose but, in actual implementations - such as the one I just unleashed this morning in [Papyrs](https://papy.rs) (a web3 blogging platform) - it might be useful to rather use default fallback values.

Therefore, here is the final form of my generic function to read items that have been saved in the `localstorage` in TypeScript using fun stuffs such as deconstructing objects, assertion and generic.

```typescript
import { browser } from "$app/env";

const isValid = (value: string | null): value is string => [null, undefined, ""].includes(value);

const getStorageItem = <T>({ key, defaultValue }: { key: string; defaultValue: T }): T => {
	const { [key]: value }: Storage = browser
		? localStorage
		: ({ [key]: undefined } as unknown as Storage);

	if (!isValid(value)) {
		return defaultValue;
	}

	return JSON.parse(value);
};
```

To infinity and beyond  
David

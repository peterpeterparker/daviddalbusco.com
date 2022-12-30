---
path: "/blog/typescript-isnullish-nonnullish-and-assertnonnullish"
date: "2022-12-30"
title: "TypeScript: isNullish, nonNullish and assertNonNullish"
description: "Three little TypeScript assertion functions that have proven to be really useful."
tags: "#typescript #programming #webdevelopment"
image: "https://images.unsplash.com/photo-1630083133034-b4644df639cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw4fHxuaWx8ZW58MHx8fHwxNjcyNDAzODEy&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://daviddalbusco.medium.com/typescript-isnullish-nonnullish-and-assertnonnullish-557deb6e8b17"
---

![Nil in the Alps](https://images.unsplash.com/photo-1630083133034-b4644df639cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw4fHxuaWx8ZW58MHx8fHwxNjcyNDAzODEy&ixlib=rb-4.0.3&q=80&w=1080)

*[Baptiste Buisson](https://unsplash.com/fr/@shoots_of_bapt_)*

There are few gems we have implemented in [NNS-dapp](https://nns.ic0.app/) that makes our devs life easier on daily basis. Among those, the following three little [TypeScript](https://www.typescriptlang.org/) functions have proven to be really useful.

* * *

## isNullish

How often have you code `if...else` statement that checks if an object is `undefined` or `null`?

```typescript
// Pseudo code (assuming optional chaining does not exist 😉)
const test = (obj: MyObject | undefined | null) => {
    if (obj === undefined || obj === null) {
        return;
    }

    obj.fn();
}
```

Thanks to [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) and [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), we have developed a helper that makes us avoid code duplication while preserving type safety.

```typescript
export const isNullish = <T>(argument: T | undefined | null): argument is undefined | null =>
	argument === null || argument === undefined;
```

The use of a generic `T` will scope the usage of the function to the types we have declared in our project.

As for the type guard, it narrows TypeScript to understand that the variable is indeed from the specific expected type. In other words, this function makes TypeScript understands that the parameter is - if it matches the checks of the function - indeed `undefined` or `null`.

We can use the helper as following:

```typescript
const test = (obj: MyObject | undefined | null) => {
    // 1. Avoid code duplication
    if (isNullish(obj)) {
        return;
    }

    // 2. TypeScript checks it is defined
    obj.fn();
}
```

* * *

## nonNullish

Sometimes we need the opposite, we need to know if something is defined. While we can negate previous shorthand function to get to know if it is the case, we also want to preserve the type safety.

This can be achieved by using the utility [NonNullable](https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype) to construct a type by excluding `undefined` and `null`.

```typescript
export const nonNullish = <T>(argument: T | undefined | null): argument is NonNullable<T> =>
	!isNullish(argument);
```

That way, TypeScript will understand that indeed, an object is defined.

```typescript
const test = (obj: MyObject | undefined | null) => {
    //1. Avoid code duplication
    if (nonNullish(obj)) {
        // 2. TypeScript checks it is defined
        obj.fn();
    }
}
```

* * *

## assertNonNullish

In addition to checking if specified conditions are truthy, throwing errors if these are falsy can be handy. Notably for the development of guards with assertion patterns.

For such purpose, we can enhance the functions we have previously developed with the [assertion signatures](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) concept that has been introduced in TypeScript 3.7.

Using the `asserts` keyword and a condition we can make TypeScript aware that a helper will perform a check and throw an error if conditions are not met.

```typescript
export class NullishError extends Error {}

export const assertNonNullish: <T>(
	value: T,
	message?: string
) => asserts value is NonNullable<T> = <T>(value: T, message?: string): void => {
	if (isNullish(value)) {
		throw new NullishError(message);
	}
};
```

Applied to our previous code snippet, we can transform the function to execute the code only if the guard is matching.

```typescript
const test = (obj: MyObject | undefined | null) => {
    // 1. Avoid code duplication
    // 2. TypeScript understands it might throw an error
    assertNonNullish(obj);
        
    // 3. TypeScript checks it is defined
    obj.fn();
}
```

* * *

## Conclusion

I find these helpers so useful that I now use these in any of my recent works - including my new "secret crazy" side project - and I bet you will do too 😁.

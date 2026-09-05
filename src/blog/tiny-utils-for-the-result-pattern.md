---
path: "/blog/tiny-utils-for-the-result-pattern"
date: "2026-09-07"
title: Two Tiny Utils for the Result Pattern
description: "A bit of Rust, a bit of TypeScript, and two small helpers to turn exceptions into results."
tags: "#typescript #rust #pattern"
image: "https://daviddalbusco.com/assets/images/sean-sinclair-FQ7cRFUU1y0-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/sean-sinclair-FQ7cRFUU1y0-unsplash.jpg)

> Photo by [Sean Sinclair](https://unsplash.com/fr/@seanwsinclair?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/une-image-floue-dun-arriere-plan-de-couleur-arc-en-ciel-FQ7cRFUU1y0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Likely because I developed my fair share of projects in Rust over the last few years, I've become quite a fan of using a `Result` pattern over multiplying `try` and `catch` blocks in TypeScript. Not every blog post needs to be about shipping rockets to outer space, so I thought I'd quickly share two small helpers I now bring with me everywhere.

---

## Background: Rust Results

Unlike JavaScript, there is no such thing as throwing and catching exceptions in Rust. Instead, functions that can fail return a value that carries either the result or the error.

Those values are typed as `Result<T, E>`, an enum which is part of the language and which contains two variants: `Ok(T)` and `Err(E)`. The former being, I guess you got it, the success, and the latter the error.

```rust
type Hello = String;
type UnknownVisitorError = String;

fn hi(name: &str) -> Result<Hello, UnknownVisitorError> {
    if name != "david" {
        return Err(String::from("UnknownVisitor"));
    }

    Ok(format!("Hello, {name}!"))
}
```

The caller has to deal with both variants - i.e. one cannot just discard or miss an error, everything is typed and expected. Classicaly, this can be achieved with a `match`:

```rust
fn main() {
    match hi("david") {
        Ok(hello) => println!("{hello}"),
        Err(err) => println!("Something went wrong: {err}"),
    }
}
```

To bubble up errors and, I guess, keep the language a bit less verbose, there's a `?` operator you can use to propagate the error up the call stack. It's a bit like `try`/`catch` was omitted.

```rust
fn greet(name: &str) -> Result<(), UnknownVisitorError> {
    let hello = hi(name)?;
    println!("{hello}");
    Ok(())
}
```

How cute 🤗

With this in mind, let's move to TypeScript.

---

## Result Pattern in TypeScript

The TypeScript version I use isn't quite that strict. I type the error as `unknown` rather than using a generic. One might argue that I lose a static guarantee about what went wrong, to which I'd say that I'd end up widening it to `unknown` anyway, because anything, anywhere, can always break in JavaScript. #trustnoone

```typescript
type Result<T> = { status: "success"; result: T } | { status: "error"; err: unknown };
```

Since we don't carry a specific error type, this is actually closer to how [`anyhow`](https://docs.rs/anyhow) works in Rust. Instead of a precise `Result<T, E>`, `anyhow::Result<T>` is really `Result<T, anyhow::Error>`, a catch-all error type that trades precision for convenience.

```rust
use anyhow::{anyhow, Result};

type Hello = String;

fn hi(name: &str) -> Result<Hello> {
    if name != "david" {
        return Err(anyhow!("UnknownVisitor"));
    }

    Ok(format!("Hello, {name}!"))
}
```

---

## Application

At this point you might wonder why and how I use this pattern. After all, handling errors just works, right? I guess I do it because, as mentioned above, I always assume something might break somewhere. Whether it's a bug in my own code, in a library I depend on, a crashing API, a corrupted DB, or just as usual ~~GitHub Actions~~ the network having hiccups, something will eventually fail, and not handling that gracefully gives users a bad impression.

Whether I'm building a frontend app, a backend server, or even a CLI, I tend to approach the solution in basically three layers: a presentation layer, some logic in between (services), and a core (communication with an API, the file system, etc.).

```
┌───────────────┐
│  Presentation │   handles Result, never try/catch
└───────┬───────┘
        │ Result<T>
┌───────────────┐
│    Services   │   catches everything, returns Result
└───────┬───────┘
        │ throws
┌───────────────┐
│      Core     │   API, DB, filesystem, throws freely
└───────────────┘
```

In this model, the presentation layer should only ever have to handle the _result_ of something, never an exception. So I try to forbid myself from using `try`/`catch` there as much as possible, and push that responsibility down to the service layer instead, which is expected to catch everything early. That's where the pattern comes in: services always return a `Result`, and the presentation layer never needs a `try`/`catch`, can never ignore an error.

As for the core, I mostly let errors bubble up. Partly to avoid too much boilerplate, but mostly because the service layer sitting right above it is already the one place responsible for catching everything, so there's no point duplicating that effort further down.

---

## Try/Catch

If the service layer is the one responsible for catching everything, you can imagine it quickly gets overwhelmed with `try`/`catch` blocks everywhere.

```typescript
export const listPizzas = async (): Promise<Result<Pizza[]>> => {
	try {
		const pizzas = await api.list();
		return { status: "success", result: pizzas };
	} catch (err: unknown) {
		return { status: "error", err };
	}
};

export const getPizza = async (id: string): Promise<Result<Pizza>> => {
	try {
		const pizza = await api.get(id);
		return { status: "success", result: pizza };
	} catch (err: unknown) {
		return { status: "error", err };
	}
};

// Etc.

// Etc.

// Etc.
```

I guess I don't really need to argue that this is quite redundant. That's why one of the first utilities I created, and which I now use actively, is a helper that executes a function, in this case a promise, and wraps both the success and the error into a `Result`.

```typescript
export const tryCatch = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
	try {
		const result = await fn();
		return { status: "success", result };
	} catch (err: unknown) {
		return { status: "error", err };
	}
};
```

That way I can just use `tryCatch` everywhere, way cleaner:

```typescript
export const listPizzas = (): Promise<Result<Pizza[]>> => tryCatch(api.list);

export const getPizza = (id: string): Promise<Result<Pizza>> =>
	tryCatch(async () => {
		return await api.get(id);
	});
```

Definitely more compact.

---

## Safe Exec

`tryCatch` covers the case where a function throws, good. But what about a service where I already implemented the `Result` pattern, one that's supposed to always return a `Result`, but where I'm not entirely sure, I didn't miss something, or that something unpredictable can't still happen?

Whatever the reason, sometimes I want a guarantee that a function I call **does not throw**.

So, I created the following helper:

```typescript
export const safeExec = async <T>(fn: () => Promise<Result<T>>): Promise<Result<T>> => {
	try {
		return await fn();
	} catch (err: unknown) {
		return { status: "error", err };
	}
};
```

Kind of a trust me bro that works. Same shape as `tryCatch`, except the function passed in already returns a `Result`. If it behaves and returns normally, `safeExec` just forwards that result. If it throws anyway, `safeExec` catches it and folds it back into the same `Result` shape.

---

## Conclusion

That's it, no rocket science, and likely some might prefer to avoid such patterns. But that's the kind of little tooling that still makes me happy to code nowadays, even though, like anyone, I'm relying on LLMs (notable to generate the boilerplate).

Hope it was a fun read, and that it inspires you to give the "result, result everywhere" pattern a shot.

Until next time!
David

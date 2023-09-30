---
path: "/blog/passing-an-async-function-as-a-parameter-in-rust"
date: "2023-08-05"
title: "Passing an Async Function as a Parameter in Rust"
description: "Learn to pass async functions as callbacks in Rust, exploring traits like Fn, FnMut, and FnOnce"
tags: "#rust #programming #beginner"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2N4KeE8ZJ5laOIibPW7a4g.jpeg"
canonical: "https://daviddalbusco.medium.com/passing-an-async-function-as-a-parameter-in-rust-6366ba6a8578"
---

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*2N4KeE8ZJ5laOIibPW7a4g.jpeg)

Photo by [Cris DiNoto](https://unsplash.com/fr/@crisdinoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/z-lh7Mz7wFQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

---

While developing canister smart contracts for Juno in Rust, I must admit that I’m not yet prominent at writing code in this programming language. As a matter of fact, I even consider myself a noob. That’s why when I have to use new patterns, it sometimes took me a bit of time to figure out how. This was exactly the case when I was looking to pass an async function as a callback parameter to another function.

As there is no better documentation for my future self than blogging, let me share the solution I discovered during this intriguing process.

## Solution

My interest in this solution was sparked by the need to refactor my code base and implement a pattern where an existing function would transform into a factory, with certain parts of it becoming dynamic while retaining its asynchronous characteristic.

To schematize this idea in this article, let’s envision two distinct functions: an incrementor and a square function, both accepting the same parameters and returning the same result.

```rust
type MyParam = u64;
type MyResult = u64;

async fn inc(
    value: MyParam,
) -> MyResult {
    value + 1
}

async fn square(
    value: MyParam,
) -> MyResult {
    value.pow(2)
}
```

Now that the functions share a common trait, we can proceed to implement the function that accepts them as parameters.

To be able to pass a function or closure as a parameter of another function, we need one of the following traits ([source](https://stackoverflow.com/a/30232500/5404186)):

- [FnOnce](https://doc.rust-lang.org/std/ops/trait.FnOnce.html) are functions that can be called once

- [FnMut](https://doc.rust-lang.org/std/ops/trait.FnMut.html) are functions that can be called if they have &mut access to their environment

- [Fn](https://doc.rust-lang.org/std/ops/trait.Fn.html) are functions that can be called if they only have & access to their environment

Furthermore, due to the asynchronous nature of the function we aim to pass, it should be specified that it returns a `Future`. A future represents an asynchronous computation obtained by using `async`.

Finally, while it could be inlined, for readability reasons, I found it convenient to use `where` constraints.

```rust
use std::future::Future;

async fn execute<F, Fut>(
    f: F,
    value: MyParam,
) -> MyResult
where
    F: FnOnce(MyParam) -> Fut,
    Fut: Future<Output = MyResult>,
{
    f(value).await
}
```

You might find the above pretty obvious if you are slightly more experienced than me in Rust, but believe me, it wasn’t that straightforward to implement such a pattern within an existing codebase because, of course, I brute-forced the implementation in my project instead of trying it first in a sample repo. 🤪

Anyway, with both the parameters and the function that accepts them ready, we can showcase their execution by calling them in a main function, for example.

```rust
#[tokio::main]
async fn main() {
    let value1 = execute(inc, 1).await;
    let value2 = execute(square, 5).await;

    println!("{} {}", value1, value2);
}
```

### Summary

In case you would like to run the snippet in the [Rust Playground](https://play.rust-lang.org), here’s the entire code above, all together:

```rust
use std::future::Future;

type MyParam = u64;
type MyResult = u64;

async fn inc(
    value: MyParam,
) -> MyResult {
    value + 1
}

async fn square(
    value: MyParam,
) -> MyResult {
    value.pow(2)
}

async fn execute<F, Fut>(
    f: F,
    value: MyParam,
) -> MyResult
where
    F: FnOnce(MyParam) -> Fut,
    Fut: Future<Output = MyResult>,
{
    f(value).await
}

#[tokio::main]
async fn main() {
    let value1 = execute(inc, 1).await;
    let value2 = execute(square, 5).await;

    println!("{} {}", value1, value2);
}
```

## Just passing a function

You might be looking as well how to pass a synchronous function as parameter. This is also possible. We can adapt the previous solution by removing the `async` nature and leveraging the `dyn` keyword to highlight that calls to methods on the associated Trait are dynamically dispatched.

```rust
type MyParam = u64;
type MyResult = u64;

fn inc(
    value: MyParam,
) -> MyResult {
    value + 1
}

fn square(
    value: MyParam,
) -> MyResult {
    value.pow(2)
}

fn execute(
    f: &dyn Fn(MyParam) -> MyResult,
    value: MyParam,
) -> MyResult
{
    f(value)
}

fn main() {
    let value1 = execute(&inc, 1);
    let value2 = execute(&square, 5);

    println!("{} {}", value1, value2);
}
```

Thank you for reading! Follow me on [Twitter](https://twitter.com/daviddalbusco) for more exciting coding content.

David

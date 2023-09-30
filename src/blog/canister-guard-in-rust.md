---
path: "/blog/canister-guard-in-rust"
date: "2022-12-15"
title: "Canister guard in Rust on the Internet Computer"
description: "Guard functions can be executed before updates and queries of canister smart contracts written in Rust on the Internet Computer."
tags: "#rust #internetcomputer #canister #smartcontract"
image: "https://images.unsplash.com/photo-1571283056653-e9802feac258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwzMnx8Z3VhcmR8ZW58MHx8fHwxNjcxMTE1ODg1&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/canister-guard-in-rust"
---

![Security from a Cypress Towne Lake event enjoyed the 4th of July fireworks with the rest of the crowd.](https://images.unsplash.com/photo-1571283056653-e9802feac258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwzMnx8Z3VhcmR8ZW58MHx8fHwxNjcxMTE1ODg1&ixlib=rb-4.0.3&q=80&w=1080)

_Photo by [Illumination Marketing](https://unsplash.com/@illuminationmarketing?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

I recently discovered it was possible to specify a guard function to be executed before update and query functions of canister smart contracts written in Rust on the [Internet Computer](https://internetcomputer.org/).

You might tell me that the following post is just a rip off of the [Crate](https://docs.rs/ic-cdk/latest/ic_cdk/attr.update.html) documentation but, as I only figured out this was possible while having a look at the [transaction notifier](https://github.com/open-ic/transaction-notifier) repo of [OpenChat](https://oc.app/), I thought it was worth a post 😄.

---

## Original approach

I began my journey with Rust when I migrated my existing Motoko code - i.e. when I upgraded the existing smart contracts of [Papyrs](https://papy.rs).

As these canisters were dedicated to user data, I had to migrate functions that required access control too.

For this purpose, I implemented comparison of principals - i.e. I match the callers of functions against users that are saved in the state. If they are equals, methods can be executed, if not, I throw errors and reject the call.

Not knowing how to write guards, I basically duplicated `if` all around the place in every calls that needed to be protected.

```rust
use candid::Principal;
use ic_cdk::{caller, trap};
use ic_cdk_macros::{query, init};
use std::cell::RefCell;

#[derive(Default)]
pub struct State {
    pub user: Option<Principal>,
}

// This canister cannot be created without user

#[init]
fn init(user: Principal) {
    STATE.with(|state| {
        *state.borrow_mut() = State { user: Some(user) };
    });
}

// Mutable global state.
// See Roman Kashitsyn's post for more info:
// https://mmapped.blog/posts/01-effective-rust-canisters.html

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
}

#[query]
fn greet(name: String) -> String {
    let user: Principal = STATE.with(|state| state.borrow().user).unwrap();

    // 🖖 Here I check if the caller matches the user who owns the canister

    if user != caller() {
        trap("User does not have the permission to say hello.");
    }

    format!("Hello, {}!", name)
}
```

While it works as I expected, you can easily imagine that duplicating the same code - particularly as the number of functions grows - slowly bloated the readability.

That was before I fortunately discovered the **guard** feature 💪.

---

## Guard

Out of the box, guards are functions that can be executed before an update or query function. When these returns an error, the related method is not proceed.

So I changed my code to take advantage of it and avoid duplication.

I created a new `guards.rs` module to execute the exact same pattern matching as the one I implemented in above code snippet.

```rust
use candid::Principal;
use ic_cdk::caller;
use crate::STATE;

pub fn caller_is_user() -> Result<(), String> {
    let caller = caller();
    let user: Principal = STATE.with(|state| state.borrow().user).unwrap();

    if caller == user {
        Ok(())
    } else {
        Err("Caller is not the user of the canister.".to_string())
    }
}
```

Once set, I then "just" replaced my existing pseudo tests with the declaration of the guard.

```rust
// ️🖖1️⃣ declare the new module
mod guards;

use candid::Principal;
use ic_cdk::{caller, trap};
use ic_cdk_macros::{query, init};
use std::cell::RefCell;
// 🖖2️⃣ the function needs to be imported
use crate::guards::caller_is_user;

#[derive(Default)]
pub struct State {
    pub user: Option<Principal>,
}

// This canister cannot be created without user

#[init]
fn init(user: Principal) {
    STATE.with(|state| {
        *state.borrow_mut() = State { user: Some(user) };
    });
}

// Mutable global state.
// See Roman Kashitsyn's post for more info:
// https://mmapped.blog/posts/01-effective-rust-canisters.html

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
}

// 🖖3️⃣ set the guard by its function's name
#[query(guard = "caller_is_user")]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}
```

And, that is basically it already 🥳.

The recipe:

1.  Create a guard function that returns an error if conditions are not met
2.  Import the module
3.  Annotate the functions that need to be protected
4.  Having fun 😁

---

## Summary

Not my longest post ever wrote but, I hope it will be useful for someone someday as it was for me to discover this small tricks.

To infinity and beyond  
David

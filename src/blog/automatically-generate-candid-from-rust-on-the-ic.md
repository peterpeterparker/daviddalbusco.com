---
path: "/blog/automatically-generate-candid-from-rust-on-the-ic"
date: "2023-03-12"
title: "Automatically generate Candid from Rust on the IC"
description: "How to auto-generate the Candid declaration from Rust code on the Internet Computer."
tags: "#rust #programming #webdevelopment #candid"
image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxOXx8d2luZG1pbGwlMjBvbiUyMGdyYXNzJTIwZmllbGR8ZW58MHx8fHwxNjc4NjUwMzQ1&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://medium.com/@daviddalbusco/automatically-generate-candid-from-rust-on-the-ic-d775ae2c9e04"
---

![Follow my Instagram @karsten.wuerth](https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxOXx8d2luZG1pbGwlMjBvbiUyMGdyYXNzJTIwZmllbGR8ZW58MHx8fHwxNjc4NjUwMzQ1&ixlib=rb-4.0.3&q=80&w=1080)

*[Karsten Würth](https://unsplash.com/fr/@karsten_wuerth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/0w-uTa0Xz7w?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

* * *

The ability to auto-generate the Candid declaration from Rust code on the Internet Computer is expected to become available in the second quarter of 2023.

In the meantime, a workaround can be used to generate these types, which I notably use in my open-source Blockchain-as-a-Service project, [Juno](https://juno.build/).

Here’s how you can implement the workaround yourself.

* * *

## 1\. Annotate

Because this solution involves a workaround, the first step is to annotate the public methods that need to be exported to Candid types.

To do this, use the `candid\_method` macro of the Candid [crate](https://docs.rs/candid/latest/candid/index.html), specifying the export type and, if necessary, the `query` type. The default is `update`.

```rust
use ic_cdk_macros::{query, update};
use ic_cdk::export::candid::{candid_method};

#[candid_method(query)]
#[query]
fn hello(name: String) -> String {
    format!("Hello, {}!", name)
}

#[candid_method]
#[update]
fn world(name: String) -> String {
    format!("World, {}!", name)
}
```

* * *

## 2\. Collect and generate

To collect the methods that we need to generate their declarations, we use the `export\_service` macro from the Candid crate. We add a `query` method and prefix its name with two underscores, as it has no practical purpose for our canister.

```rust
#[query(name = "__get_candid_interface_tmp_hack")]
fn export_candid() -> String {
    export_service!();
    __export_service()
}
```

* * *

## 3\. Save to file system with a test

Since we need a hook to initiate the generation of the DID files, we use the test runner to execute the necessary steps. This is why we use a test module for this purpose.

```rust
#[cfg(test)]
mod tests {
    use super::export_candid;

    #[test]
    fn save_candid() {
        use std::env;
        use std::fs::write;
        use std::path::PathBuf;

        let dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());
        let dir = dir
            .parent()
            .unwrap()
            .parent()
            .unwrap()
            .join("src")
            .join("demo");
        write(dir.join("demo.did"), export_candid()).expect("Write failed.");
    }
}
```

The above snippet is designed for a canister named `demo` and a file structure relative to a standard sample architecture `root/src/demo/Cargo.toml`. Please update the path and name based on your project requirements.

That's all! 😁 Simply run `cargo test` and a `did` file should be automatically generated.

```rust
service : { 
  hello : (text) -> (text) query; 
  world : (text) -> (text) 
}
```

* * *

## Conclusion

Of course, you can always wait until Q2 or avoid these shenanigans by using [Juno](https://juno.build) (😄). Nonetheless, I hope this short blog post will be useful to you.

To infinity and beyond!  
David
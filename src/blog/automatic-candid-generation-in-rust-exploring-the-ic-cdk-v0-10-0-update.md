---
path: "/blog/automatic-candid-generation-in-rust-exploring-the-ic-cdk-v0-10-0-update"
date: "2023-07-21"
title: "Automatic Candid Generation in Rust: Exploring the ic_cdk v0.10.0 Update"
description: "How to Automatically Generate Candid from Rust on the IC and Migrate Your Existing Project to Utilize the Latest Version of ic_cdk."
tags: "#rust #internetcomputer #candid"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BJliLFjN_gUXOpMLsCQ1tQ.jpeg"
canonical: "https://daviddalbusco.medium.com/automatic-candid-generation-in-rust-exploring-the-ic-cdk-v0-10-0-update-d1ad76bd4f69"
---

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BJliLFjN_gUXOpMLsCQ1tQ.jpeg)

Photo by [Bilal O.](https://unsplash.com/@lightcircle?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/ljXekphwr40?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

---

So, yesterday I upgraded [Juno](https://juno.build/) to the latest release of [ic_cdk](https://github.com/dfinity/cdk-rs/blob/main/src/ic-cdk/CHANGELOG.md#0100---2023-07-13) and discovered that the automatic generation of the Candid declarations needed an update. In this post, I will walk you through the process of migrating your project.

## Previous Workaround

If you have previously relied on automatic type generation, chances are you used the export_service crate and the workaround involving generating and writing the did files to the file system through a test by running cargo test .

I covered this approach in a [previous blog post](https://daviddalbusco.com/blog/automatically-generate-candid-from-rust-on-the-ic/) earlier this year, but to summarize, your code most probably looked like the following:

```rust
use ic_cdk_macros::{query, update};
use ic_cdk::export::candid::{candid_method};
use ic_cdk::export::candid::{export_service};

// Your code

#[candid_method(query)]
#[query]
fn hello(name: String) -> String {
    format!("Hello, {}!", name)
}

#[candid_method(update)]
#[update]
fn world(name: String) -> String {
    format!("World, {}!", name)
}

// The workaround to generate did files automatically

fn export_candid() -> String {
    export_service!();
    __export_service()
}

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

## New Solution

No more workarounds! ic_cdk v0.10.0 introduces a new macro called export_candid, designed specifically to facilitate automatic generation of the did files.

Therefore, if you are migrating or starting a new canister and want to generate the types automatically, the new solution basically consists of adding export_candid!() at the end of lib.rs, and that's all you need for the code.

However, it’s worth noting that the effective creation of the files is not yet integrated into dfx. As a result, you will need a script to generate them.

But no worries, I will spare you the hassle of building such a script and share a solution with you in the next chapter.

## Migration Guide

If you are following this blog post to generate did files automatically for a new canister, you can skip the first steps and jump directly to step 4. However, if you are migrating an existing project that implements the workaround, begin by removing it:

1. Remove all #[candid_method(query)] and #[candid_method(update)] from your code. These attributes are no longer required and, in fact, they conflict with the new solution.

2. Delete the all workaround export_service and save_candid test.

3. Suppress the related imports (use ic_cdk::export::candid::{export_service, candid_method}) that have become unused.

4. Import and add the export_candid macro at the end of your lib.rs

```rust
use ic_cdk_macros::{query, update, export_candid};

// Your code

#[candid_method(query)]
#[query]
fn hello(name: String) -> String {
format!("Hello, {}!", name)
}

#[candid_method(update)]
#[update]
fn world(name: String) -> String {
format!("World, {}!", name)
}

// Generate did files

export_candid!();
```

5. Add the following script to your project or copy it from Juno’s repo: [https://github.com/buildwithjuno/juno/blob/main/scripts/did.sh](https://github.com/buildwithjuno/juno/blob/main/scripts/did.sh)

```bash
#!/usr/bin/env bash

function generate_did() {
    local canister=$1
    canister_root="src/$canister"

    cargo build --manifest-path="$canister_root/Cargo.toml" \
    --target wasm32-unknown-unknown \
    --release --package "$canister" \
    --features "ic-cdk/wasi"

    # Installation https://docs.wasmtime.dev/cli-install.html
    wasmtime "target/wasm32-unknown-unknown/release/$canister.wasm" > "$canister_root/$canister.did"
}

# The list of canisters of your project
CANISTERS=console,observatory,mission_control,satellite

for canister in $(echo $CANISTERS | sed "s/,/ /g")
do
generate_did "$canister"
done
```

6. Optional: ⭐️ star [Juno’s repo on GitHub](https://github.com/buildwithjuno/juno) and show your support!

7. Update the scripts variable CANISTERS with the names of the canisters in your project (comma separated list).

That’s it, you’re all set! You can now run $ did.sh in your terminal to generate the did files for your project 🎉.

Personally, I like to automate and chain tasks, including the generation of the related formatted JavaScript file. That’s why I also suggest setting up the following scripts in your package.json to go a step further:

```json
"scripts": {
  "format": "prettier --write .",
  "generate": "scripts/did.sh && dfx generate && npm run format",
}
```

That way, you can now run npm run generate which will take care of everything to have everything set up for implementing your frontend.

## Known Errors and Solutions

During the migration process, I encountered various issues. Below are the problems I faced along with their respective solutions, in case you encounter similar challenges:

### **duplicate method name**

If you have forgotten to remove the attribute macro #[candid_method] from your code, running the did.sh script may result in an error: duplicate method name and cannot find function . Make sure to remove the attribute macro to resolve this issue (see step 1. of previous chapter).

```
error: duplicate method name del_controllers
   --> src/console/src/lib.rs:232:4
    |
232 | fn del_controllers(DeleteControllersArgs { controllers }: DeleteControllersArgs) {
    |    ^^^^^^^^^^^^^^^

error[E0425]: cannot find function `del_controllers` in this scope
   --> src/console/src/lib.rs:232:4
```

### candid::types::reference::Func

If your canister implements a streaming strategy, you might encounter the following error:

```
Error: failed to run main module `target/wasm32-unknown-unknown/release/satellite.wasm`

Caused by:
    0: failed to invoke command default
    1: error while executing at wasm backtrace:
           0: 0x204828 - <unknown>!__rust_start_panic
           1: 0x2047f7 - <unknown>!rust_panic
           2: 0x2047c7 - <unknown>!std::panicking::rust_panic_with_hook::h70a0e195f4db2a29
           3: 0x203d2b - <unknown>!std::panicking::begin_panic_handler::{{closure}}::hdcfc819ce836829e
           4: 0x203c90 - <unknown>!std::sys_common::backtrace::__rust_end_short_backtrace::h53cabafab5b09ada
           5: 0x204432 - <unknown>!rust_begin_unwind
           6: 0x205b2f - <unknown>!core::panicking::panic_fmt::h751be80779d42b53
           7: 0x1dc870 - <unknown>!<candid::types::reference::Func as candid::types::CandidType>::_ty::h5a3086fe78ee70eb
           8: 0x734f4 - <unknown>!candid::types::CandidType::ty::h3629ad9f5296022d
           9: 0x983bd - <unknown>!candid::types::CandidType::ty::h9570a7b7bc1b89e8
          10: 0xace19 - <unknown>!candid::types::CandidType::ty::hba90fc116dda9bd1
          11: 0x95616 - <unknown>!candid::types::CandidType::ty::hee774e983a92def6
          12: 0x607d3 - <unknown>!_start
       note: using the `WASMTIME_BACKTRACE_DETAILS=1` environment variable may show more debugging information
    2: wasm trap: wasm `unreachable` instruction executed
```

If you do face such issue, the root cause is probably the usage of the candid::Func in the declaration of the strategy:

```rust
#[derive(CandidType, Deserialize, Clone)]
pub enum StreamingStrategy {
    Callback {
        token: StreamingCallbackToken,
        callback: Func, // <------------- root cause of the issue
    },
}
```

This can be solve by using a define_function! which is the recommend way according [Yan Chen](https://github.com/chenyan-dfinity).

```rust
use candid::{define_function, CandidType, Deserialize};

define_function!(pub CallbackFunc : () -> () query);

#[derive(CandidType, Deserialize, Clone)]
pub enum StreamingStrategy {
    Callback {
        token: StreamingCallbackToken,
        callback: CallbackFunc,
    },
}
```

However, by modifying the type, the usage of the strategy will most probably need to be updated as well. For example, this was my original usage:

```rust
pub fn streaming_strategy(
    key: &AssetKey,
    encoding: &AssetEncoding,
    encoding_type: &str,
    headers: &[HeaderField],
) -> Option<StreamingStrategy> {
    let streaming_token: Option<StreamingCallbackToken> =
        create_token(key, 0, encoding, encoding_type, headers);

    streaming_token.map(|streaming_token| StreamingStrategy::Callback {
        callback: CallbackFunc { // <----------- Error fields are missing
            method: "http_request_streaming_callback".to_string(),
            principal: id(),
        },
        token: streaming_token,
    })
}
```

Which I had to convert to following:

```rust
pub fn streaming_strategy(
    key: &AssetKey,
    encoding: &AssetEncoding,
    encoding_type: &str,
    headers: &[HeaderField],
) -> Option<StreamingStrategy> {
    let streaming_token: Option<StreamingCallbackToken> =
        create_token(key, 0, encoding, encoding_type, headers);

    streaming_token.map(|streaming_token| StreamingStrategy::Callback {
        callback: CallbackFunc::new(id(), "http_request_streaming_callback".to_string()),
        token: streaming_token,
    })
}
```

### unknown import: `ic0::stable64_size`

Finally, if you are using [stable structures](https://github.com/dfinity/stable-structures), you might encounter the following issue:

```
Error: failed to run main module `target/wasm32-unknown-unknown/release/orbiter.wasm`

Caused by:
    0: failed to instantiate "target/wasm32-unknown-unknown/release/orbiter.wasm"
    1: unknown import: `ic0::stable64_size` has not been defined
```

There is currently a [PR](https://github.com/dfinity/stable-structures/pull/108) in development that will solve the issue. It will ultimately require updating your project with a new version of the stable structures crate but, meanwhile, you can try using the patch that is in progress if you wish. It worked out for me.

```
ic-stable-structures = { git = "https://github.com/lwshang/stable-structures.git", branch = "lwshang/update_cdk"}
```

Thanks for reading! Follow me on [Twitter](https://twitter.com/daviddalbusco) for more coding content and reach out if you have any questions.

David
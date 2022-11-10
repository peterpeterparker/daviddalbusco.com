---
path: "/blog/few-things-to-know-before-launching-a-sveltekit-app-in-prod"
date: "2022-11-10"
title: "Migrate canister smart contracts from Motoko to Rust"
description: "I migrated 500+ canisters from Motoko to Rust on the Internet Computer. Here are the two major things I learned."
tags: "#motoko #rust #programming #technology"
image: "https://images.unsplash.com/photo-1464925885047-b49393632a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxOHx8bWlncmF0ZXxlbnwwfHx8fDE2Njc3MjY0NDU&ixlib=rb-4.0.3&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/migrate-canister-smart-contracts-from-motoko-to-rust"
---

![Whale tail](https://images.unsplash.com/photo-1464925885047-b49393632a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHwxOHx8bWlncmF0ZXxlbnwwfHx8fDE2Njc3MjY0NDU&ixlib=rb-4.0.3&q=80&w=1080)

*Photo by [Jeremy Bishop](https://unsplash.com/@jeremybishop?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

* * *

Last Friday (November 4, 2022) I upgraded the code of the 1'000+ canister smart contracts of [Papyrs](https://papy.rs) - an open-source, privacy-first, decentralized blogging platform. Among these, half of them have had their source code rewritten entirely from Motoko to Rust.

The [Internet Computer](https://internetcomputer.org/) - the general-purpose blockchain that hosts these canisters - [uses the WebAssembly](https://internetcomputer.org/features/webassembly/) VM to run its smart contracts. These can be written in various programming languages including the two languages mentioned above.

While on the paper and in practice switching the code base from one to the other works out like a charm, I had few challenges to solve first before being able to execute such a migration. Among these, two questions required a particular attention:

1.  Dynamically creating Rust canisters from a Motoko canister
2.  Upgrading a rewritten smart contract while preserving its state

Two topics I would like to share with you in this blog post.

* * *

## 1\. Creating Rust canister on the fly

On Papyrs there is no single smart contract that holds the data for all the users. Each of them get their own realm. Upon sign-in, each member of the community gets two canisters: one for the data ("db") and another to serve the blogs on the web (a "CDN storage").

As I was looking to migrate that last type of canisters, I had to find a way to create Rust based canister on the fly from my existing "manager" canister written in Motoko.

*\> Interested to get to know how I dynamically create smart contracts on the fly in Motoko? Checkout this 👉 [blog post](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/dynamically-create-canister-smart-contracts-in-motoko).*

I rapidly discovered that it was possible to solve such feature by actually changing few lines of my code. Indeed, importing a Rust canister within Motoko and within the same project with the help of a simple `import` just works out.

```javascript
// src/motoko_canister/main.mo

import RustCanister "canister:rust_canister";

actor Main {

    public shared ({ caller }) func hello() : async (Principal) {
        let canisterId = await RustCanister.world(caller);
        return canisterId;
    };

}

// src/rust_canister/src/lib.rs

use candid::Principal;
use ic_cdk_macros::{update};
use ic_cdk::{api};

#[update]
async fn create_bucket(_user_id: Principal) -> Principal {
    let caller = api::caller();
    caller
}
```

However, this was not exactly my use case - i.e. I was not looking to call one given particular canister but rather to create new smart contracts on the fly.

After following various paths, I finally chose the one that consists of implementing a generic solution. I implemented a function that creates new canister and install code from wasm bytes. That way, it does not matter if the code of the canisters has been developed in Rust or any other language.

```javascript
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

// types for the IC. e.g. available in https://github.com/papyrs/ic
import IC "./ic.types";

actor Main {

    private let ic : IC.Self = actor "aaaaa-aa";

    private stable var storageWasm: [Nat8] = [];

    public shared ({ caller }) func init() : async (Principal) {
        // Indicates the cycles to be transferred in the next call
        Cycles.add(1_000_000_000_000);

        // Create a new canister
        let { canister_id } = await ic.create_canister({ settings = null });

        // Set the controllers of the new canister
        // In this case this canister, the caller and the canister itself        
        let self : Principal = Principal.fromActor(Main);
        let controllers : ?[Principal] = ?[canister_id, caller, self];

        // Update the settings to apply the controllers
        await ic.update_settings(({
            canister_id;
            settings = {
                controllers = controllers;
                freezing_threshold = null;
                memory_allocation = null;
                compute_allocation = null;
            };
        }));

        // Example. to_candid can be used to encode initial args
        let arg: Blob = to_candid(caller);

        // Finally install the generic wasm code
        await ic.install_code({
            arg;
            wasm_module = Blob.fromArray(storageWasm);
            mode = #install;
            canister_id;
        });

        return canister_id;
  };
}
```

What's happening here?

1.  The function starts by indicating how much cycles will be transferred in the next call to create a new canister.
2.  The creation happens and the IC provides the new canister ID.
3.  In my particular use case, I want the user and the "manager" (until hopefully someday I defer Papyrs to a Sns) to be set as controllers of the newly created canister. That is why the function update these settings. Note that I am not sure if this step can be spared by providing the controllers when creating the canister in previous step 2. As far as I remember it did not worked out once so I always proceed that way.
4.  It encodes the arguments that are needed to initialize the wasm code. If there is no initialization parameters this can be spared.
5.  It finally installs the wasm code - i.e. the Rust code I have written and compiled.

At this point, you might ask yourself where does the wasm code comes from? I will explain this promptly.

At first, I had that idea to load the bytes at build time when the Motoko code was compiled. This unfortunately did not succeed because of memory limitation. After discussing the issue on the [forum](https://forum.dfinity.org/t/read-local-file-at-build-time-with-motoko/15945), [Austin Fatheree](https://twitter.com/afat) shared the idea to upload the wasm code in memory once the "manager" canister has been deployed. This was the solution I selected and implemented.

```javascript
actor Main {

    private stable var storageWasm: [Nat8] = [];

    public shared ({ caller }) func storateResetWasm(): async () {
      // Reject invalid caller
      storageWasm := [];
    };

    public shared ({ caller }) func storageLoadWasm(blob: [Nat8]): async ({total: Nat; chunks: Nat;}) {
        // Reject invalid caller

        // Note: Array.append is deprecated but buffer.append needs dfx v12
        // Issue: https://forum.dfinity.org/t/array-to-buffer-in-motoko/15880/15

        storageWasm := Array.append<Nat8>(storageWasm, blob);

        // Return total wasm sizes
        return {
            total = storageWasm.size();
            chunks = blob.size();
        }
    };
};
```

I added two functions to the canister that creates the other canisters. One to reset the state and another that appends the wasm code chunks to the local state.

⚠️ These functions need some proper assertions not implemented in above snippet. You most probably do not want attackers to be able to overwrite and replace the state with some malicious wasm code.

Finally, I created a NodeJS script that reads the wasm code and calls above endpoints to load the wasm code I have developed in the memory of the "manager".

```javascript
import { readFile } from "fs/promises";
import {canisterId, managerActor} from "./manager.actor.mjs";

const loadWasm = async () => {
  const buffer = await readFile(
    `${process.cwd()}/.dfx/local/canisters/my_rust_canister/my_rust_canister.wasm`
  );
  return [...new Uint8Array(buffer)];
};

const resetWasm = async () => {
  await managerActor.storateResetWasm();
}

const installWasm = async (wasmModule) => {
  console.log(`Installing wasm code in: ${canisterId}`);

  const chunkSize = 700000;

  const upload = async (chunks) => {
    const result = await managerActor.storageLoadWasm(chunks);
    console.log("Chunks:", result);
  };

  for (let start = 0; start < wasmModule.length; start += chunkSize) {
    const chunks = wasmModule.slice(start, start + chunkSize);
    await upload(chunks);
  }

  console.log(`Done: ${canisterId}`);
};

(async () => {
  const wasmModule = await loadWasm();

  // Install wasm in manager
  await resetWasm();
  await installWasm(wasmModule);
})();

```

* * *

## 2\. Upgrading and preserving state

While previous chapter was probably more related to the way Papyrs behaves, being able to migrate a Motoko canister to Rust while preserving its state on mainnet definitely could have been a show stopper if it would not have been supported. Of course, spoiler alert 😜, it is and the migration went absolutely smoothly.

One key feature of the Internet Computer is its ability to persist canister smart contract state using WebAssembly memory and globals.

That is why a canister can be upgraded regardless of the programming language.

Being said, fine it is, easy maybe a bit less. Particularly for a fully Rust newbie as myself 😅.

Given a following canister, I reasonably assumed that the stable memory had to be decoded in the new one, in the one written in Rust. However, I had no idea how 🤷‍♂️.

```javascript
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Text "mo:base/Text";

actor Demo {

    private stable var test: Nat = 666;

    private type Asset = {
        key : Text;
        modified : Int;
        contentChunks: [[Nat8]];
    };

    private stable var entries: [(Text, Asset)] = [];

    system func preupgrade() {
        entries := [("yolo", {
            key = "hello";
            modified = Time.now();
            contentChunks = [Blob.toArray(Text.encodeUtf8("world"))];
        })]
    };

    system func postupgrade() {
        // Postupgrade will happens in Rust.
        // Memory has to be decoded there.
    };

};
```

Fortunately the amazing IC community shined once again and thanks to the help of [Frederik Rothenberger](https://forum.dfinity.org/u/frederikrothenberger) and particularly to [Alexander Vtyurin](https://forum.dfinity.org/u/senior.joinu) code snippet, the biggest issue I had could be resolved on the [forum](https://forum.dfinity.org/t/upgrade-canister-from-motoko-to-rust-with-stable-memory/)!

In Rust, the stable memory that has been populated before the upgrade can be read in a post upgrade hook with the help of the [stable API](https://docs.rs/ic-cdk/latest/ic_cdk/api/stable/index.html) and decoded using candid [decode\_args](https://docs.rs/candid/latest/candid/utils/fn.decode_args.html).

```rust
mod types;

use ic_cdk::{api::{ stable:: { stable_read } }};
use candid::{decode_args};
use ic_cdk_macros::{post_upgrade};
use std::cell::RefCell;

// UpgradeState is a custom type
use crate::types::{demo::{State}};

thread_local! {
    static STATE: RefCell<State> = RefCell::default();
}

#[post_upgrade]
fn post_upgrade() {
    // By senior.joinu - not all heroes wear capes

    // BEGIN: read the stable memory in a buffer
    let mut stable_length_buf = [0u8; std::mem::size_of::<u32>()];
    stable_read(0, &mut stable_length_buf);
    let stable_length = u32::from_le_bytes(stable_length_buf);
 
    let mut buf = vec![0u8; stable_length as usize];
    stable_read(std::mem::size_of::<u32>() as u32, &mut buf);
    // END: read

    // Decode the memory buffer
    let (state,): (State,) = decode_args(&buf).unwrap();

    // e.g. populate state
    let new_state: State = State {
        test: state.test,
        entries: state.entries
    };

    STATE.with(|state| *state.borrow_mut() = new_state);
}
```

While this was a major milestone, the challenge was not over yet. The memory still had to be "re-structured".

For this specific task I did not find any silver bullet. The types had to be manually converted - i.e. I went through my Motoko code and I rewrote all the types from scratch (I know, I have got weird hobbies 😅).

```rust
pub mod demo {
    use candid::{CandidType, Int};
    use serde::{Serialize, Deserialize};

    #[derive(CandidType, Deserialize, Serialize)]
    pub struct Asset {
        pub key: String,
        pub modified: Int,
        pub contentChunks: Vec<Vec<u8>>,
    }

    #[derive(Default, CandidType, Deserialize, Serialize)]
    pub struct State {
        pub test: Option<u128>,
        pub entries: Option<Vec<(String, Asset)>>,
    }
}
```

Above snippet are the corresponding types for the preceding Motoko code and here are the most important takeover of such a conversion:

*   variable names have to match. If a stable variable is named `test` in Motoko, it has to be named `test` in Rust.
*   all root types that are decoded from the stable memory become optional regardless if they were declared mandatory or not in previous code.
*   not declaring these types as optional leads to a decoding error that will be thrown in the local IC started with dfx.
*   any type at any levels of the conversion that does not match the original type will lead to a silent error (⚠️) and will have for effect to decode to none. e.g. in above example, if I would had declared `modified` as a `u128` instead of a the correct `candid::int` - which relates to the Motoko `Time` - the all `entries` would just have been decoded to none. No error, no stracktrace, just none and an ocean of tears.

Once the memory read and re-structured, the upgrade was almost achieved. There was no other big blockers. I could persist the state and all data were still there.

* * *

## Sample repo

To validate the hypothesis of such a migration, I developed both chapters in two distinctive sample repo. Their code is not as clean as the final implementation but if they can be useful here are these:

*   Motoko Rust interop validation 👉 [https://github.com/peterpeterparker/motoko\_rust\_interop](https://github.com/peterpeterparker/motoko_rust_interop)
*   Motoko to Rust migration 👉 [https://github.com/peterpeterparker/motoko\_to\_rust\_migration](https://github.com/peterpeterparker/motoko_to_rust_migration)

My migration being over, the related code I executed on mainnet has been archived but, you can still find it in the history of the backend and providers of Papyrs 👉 [https://github.com/papyrs/ic](https://github.com/papyrs/ic)

* * *

## Summary

I migrated 500+ canisters from Motoko to Rust on the Internet Computer.

Seriously, I am not gonna lie and because I did not trust myself on this, I almost still cannot believe that it worked out on mainnet without a single issue 🤯.

It is probably due to the fact that I executed the all migration process at least 50th times from scratch locally and few times on mainnet as well.

Therefore, if I can share one last advice if you intent to perform such a migration too: test, test & test before executing!

To infinity and beyond  
David
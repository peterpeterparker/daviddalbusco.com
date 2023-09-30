---
path: "/blog/how-to-install-code-in-child-canister-with-nodejs"
date: "2022-08-11"
title: "Install code in child canisters with NodeJS"
description: "How to upgrade smart contracts on the Internet Computer with JavaScript"
tags: "#javascript #nodejs #web3 #internetcomputer"
image: "https://images.unsplash.com/photo-1620207418302-439b387441b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw1Nnx8YWJzdHJhY3R8ZW58MHx8fHwxNjU5MTgzOTI4&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/install-code-in-child-canisters-with-nodejs"
---

![Fakurian.com](https://images.unsplash.com/photo-1620207418302-439b387441b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw1Nnx8YWJzdHJhY3R8ZW58MHx8fHwxNjU5MTgzOTI4&ixlib=rb-1.2.1&q=80&w=1080)

_Photo by [Milad Fakurian](https://unsplash.com/@fakurian?utm_source=Papyrs&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

---

On [Papyrs](https://papy.rs) - a web3 open source blogging platform - each user gets two smart contract canisters upon sign-in. One that contains private data and another that enables the user's personal blog-space on the internet.

Until the day I (hopefully) hand over the control of all canisters to a [Sns](https://medium.com/dfinity/how-the-service-nervous-system-sns-will-bring-tokenized-governance-to-on-chain-dapps-b74fb8364a5c) and the community, I might have to install new version of the code in users' smart contracts by my self - e.g. to fix issues (😅) or to deploy new features (😎).

This article describes how I can install code with [NodeJS](https://nodejs.org/en/) scripts and how you could do as well.

---

## Getting started

Earlier this year I published two related articles:

1.  [Dynamically create smart contracts in Motoko](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/dynamically-create-canister-smart-contracts-in-motoko)

2.  [Call Internet Computer canisters in NodeJS](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/call-internet-computer-canister-smart-contracts-in-nodejs)

These articles lead to this tutorial. The first display how to query canisters in NodeJS and the second how to create smart contracts on the fly - i.e. how to create canisters in which, I want to install newer version of my code 😜.

---

## Child canister

I use the first of the two above posts to create a local sample project. After compilation and deployment - to a local simulated IC network - I open my browser and create on the fly a child canister `renrk-eyaaa-aaaaa-aaada-cai`.

![capture-d%E2%80%99e%CC%81cran-2022-08-06-a%CC%80-14.12.30.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-08-06-a%CC%80-14.12.30.png?token=JeWh3mMWht9_YVR_UNkt1)

This sample smart contract is the one I aim to update in following chapters. That is why I bump its version by modifying its source code as following:

```typescript
import Nat "mo:base/Nat";

actor class Bucket(user: Text) = this {

    var version: Nat = 2; // <-- Bump v2

    public query func say() : async Text {
      return "Hello World - " # user # " - v" # Nat.toText(version);
    };

}
```

Once modified, I have to re-generate the wasm binary that will be installed - deployed to the IC. To do so, I have to follow the workaround I shared in my previous post because, [currently](https://forum.dfinity.org/t/how-do-i-upgrade-child-canisters-that-were-dynamically-created-from-a-parent-canister-of-which-i-am-the-controlller-in-motoko/12289/27?u=peterparker), there is "no other way of producing the wasm of the imported class as a separate, non-embedded thing".

1.  Edit the configuration `dfx.json` to list the bucket actor.
2.  Run the `dfx deploy` command to generate the files. The command will end in error ("Error: Invalid data: Expected arguments but found none.") that can safely be ignored 😉.

3.  Revert the change in `dfx.json`.

---

## Backend

Only controllers of the canister can install new version of the code. As the child canisters are created by a main actor - which I named `manager` - I had to take care to add its principal to the list of controllers while updating the settings in my previous tutorials.

So in this solution, this actor will install the code and the NodeJS script will "only" be a caller.

![excalidraw-1659866676272.webp](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/excalidraw-1659866676272.webp?token=TdtbJr-ic5c_Q2V6JGQ-w)

The backend feature to install code - `install\_code` - is part of the [IC interface specification](https://github.com/dfinity/interface-spec/blob/master/spec/ic.did). Therefore, I can add a function to my `manager` that acts as a proxy which receives the information and calls that core feature of the IC.

**Important note**: following code snippet is a public function! If you implement such a feature in your smart contracts on `mainnet`, please apply the appropriate safety precautions.

```typescript
import IC "./ic.types";

actor Main {
  private let ic : IC.Self = actor "aaaaa-aa";

  public func installCode(canisterId: Principal, arg: Blob, wasmModule: Blob): async() {
      await ic.install_code({
          arg = arg;
          wasm_module = wasmModule;
          mode = #upgrade;
          canister_id = canisterId;
      });
  };
};
```

To install code in my target canister, I need four parameters:

1.  a target canister id
2.  the wasm module - the new version of the wasm code I built in previous chapter with my workaround
3.  a `mode` set to `#upgrade` to perform an update as described in [Canister upgrades](https://internetcomputer.org/docs/current/references/ic-interface-spec/#system-api-upgrades) - with the goal to maintain the state
4.  arguments - those that are used to initialize the canister

---

## NodeJS script

I can implement the call to the endpoint of the `manager` in a NodeJS module script I named `installcode.mjs`. The script will take care of collecting the parameters mentioned above before effectively calling my actor (function `upgradeBucket`).

```javascript
import { Principal } from "@dfinity/principal";
import { IDL } from "@dfinity/candid";

const installCode = async () => {
	// Param 1.
	const canisterId = Principal.fromText("renrk-eyaaa-aaaaa-aaada-cai");

	// Param 2.
	const wasmModule = loadWasm();

	// Param 3.
	const arg = IDL.encode([IDL.Text], ["User1"]);

	// Agent-js actor
	const actor = await managerActor();

	// Execute
	await upgradeBucket({ actor, wasmModule, canisterId, arg });
};

try {
	await installCode();
} catch (err) {
	console.error(err);
}
```

---

The first parameter is the targeted canister id as `Principal`. As I collected the local child canister as a `string` when I printed its id - `renrk-eyaaa-aaaaa-aaada-cai` - in the browser console, I need to convert it the help of `Principal.fromText()`.

---

The second parameter I need is the wasm module. To collect it, I can read the file that has been generated when I previously ran `dfx deploy` and can transform it to an `ArrayBuffer` - the expected type that matches to the `Blob` defined in the backend actor's code.

```javascript
import { readFileSync } from "fs";

const loadWasm = () => {
	const localPath = `${process.cwd()}/.dfx/local/canisters/bucket/bucket.wasm`;
	const buffer = readFileSync(localPath);
	return [...new Uint8Array(buffer)];
};
```

---

The third parameter is the one that matches those use to create the canister on the fly 🤪. Concretely, the bucket's actors of this tutorial are created with a `user` parameter:

```javascript
actor class Bucket(user: Text) = this {
    // commented
}
```

So, to install the code, I need to provide the same parameters which has to be encoded with Candid (otherwise the parameters are rejected):

```javascript
import { IDL } from "@dfinity/candid";

const arg = IDL.encode([IDL.Text], ["User1"]);
```

Note that `IDL` support various format - e.g. if the Motoko parameter would have been a `Principal`, I could have encoded it as following:

```javascript
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

const arg = IDL.encode([IDL.Principal], [Principal.fromText("rrrrr-ccccc-user-principal")]);
```

---

To instantiate the `manager` actor, once I find its canister ID, I can proceed as I would commonly do with [agent-js](https://github.com/dfinity/agent-js):

```javascript
import { idlFactory } from "./.dfx/local/canisters/manager/manager.did.mjs";
import fetch from "node-fetch";
import { HttpAgent, Actor } from "@dfinity/agent";

const managerActor = async () => {
	const canisterId = managerPrincipalLocal();

	// Replace host with https://ic0.app for mainnet
	const agent = new HttpAgent({ fetch, host: "http://localhost:8000/" });

	// Only if local IC
	await agent.fetchRootKey();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId
	});
};
```

However, there is one subtlety: because I am writing a module script - `.mjs` - I cannot `import` the `idlFactory` script that was automatically generated by `dfx` as a `.js` file.

To overcome this issue, I just had to copy it to change its extension. Fortunately this does the trick.

```bash
cp ./.dfx/local/canisters/manager/manager.did.js ./.dfx/local/canisters/manager/manager.did.mjs
```

The principal ID of the `manager` deployed on a local simulated IC can be found in the `.dfx` folder.

```javascript
const managerPrincipalLocal = () => {
	const buffer = readFileSync("./.dfx/local/canister_ids.json");
	const { manager } = JSON.parse(buffer.toString("utf-8"));
	return Principal.fromText(manager.local);
};
```

Ultimately, if you would deploy on `mainnet`, you would be able to find the same information in the `canister\_ids.json` present at the root of your project.

```javascript
const managerPrincipalIC = () => {
	const buffer = readFileSync("./canister_ids.json");
	const { manager } = JSON.parse(buffer.toString("utf-8"));
	return Principal.fromText(manager.ic);
};
```

Note that you would also have to comment `fetchRootKey` and change the `host` property in the `HttpAgent` initialization.

---

Finally, the effective call that will install the code can be implemented with the parameters I collected.

```javascript
const upgradeBucket = async ({ actor, wasmModule, canisterId, arg }) => {
	console.log(`Upgrading: ${canisterId.toText()}`);

	await actor.installCode(canisterId, [...arg], wasmModule);

	console.log(`Done: ${canisterId.toText()}`);
};
```

---

## Test

Everything is set. I can call my NodeJS script - `node installcode.mjs`.

![capture-d%E2%80%99e%CC%81cran-2022-08-11-a%CC%80-07.28.30.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-08-11-a%CC%80-07.28.30.png?token=uybSEtIIQCrd1yLDkqzwe)

The installation was a success. To be certain the code was deployed, I called afterwards the canister - which was updated - to check that indeed, it now returned the new version - `v2` - I was expecting and, indeed it worked out 🎉.

---

## Conclusion and sample repo

You can find the source code of this tutorial in a sample repo I published on GitHub:

👉 [https://github.com/peterpeterparker/manager](https://github.com/peterpeterparker/manager)

I hope it will be useful for the community and let me know if you have idea of improvements!

To infinity and beyond  
David

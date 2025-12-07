---
path: "/blog/til-programming-ep1"
date: "2024-02-25"
title: "TIL Programming Ep1"
description: "In this episode, I learned about TypeScript string patterns and Node.js WASM metadata reading."
tags: "#programming #webdev #showdev #til"
image: "https://daviddalbusco.com/assets/images/1*7DPrmiwTpheVxgpZ9rjSUA.jpeg"
canonical: "https://daviddalbusco.medium.com/til-programming-ep1-5bb58690a120"
---

![](https://daviddalbusco.com/assets/images/1*7DPrmiwTpheVxgpZ9rjSUA.jpeg)

Photo by [Joanna Kosinska](https://unsplash.com/fr/@joannakosinska?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/fr/photos/deux-crayons-gris-sur-surface-jaune-1_CMoFsPfso?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

---

I’ve been on this blogging journey for a while, aiming to share a least a new post every month. Yet, finding the time and motivation isn’t easy anymore, especially with the seismic shifts in how we consume content post the AI merge. The appetite for long-form blog posts and detailed tutorials seems to be waning, at least from my perspective. Ironically, while my motivation for these extensive pieces dwindles, my activity on **[X / Twitter](https://twitter.com/daviddalbusco)** remains unabated. There, in the flurry of daily interactions, I often share snippets of what I’ve learned, encapsulated in “TIL…” tweets.

It dawned on me — Why not transform these brief insights into a series of blog posts? And so, here we are, at the inception of what I hope to be a series that blends the brevity of tweets with the depth of a blog. Welcome to the first episode of this journey. Let’s dive in what tips I learned in February 2024!

---

## TIL: Defining String Patterns with TypeScript

This month, I learned about using template literals in TypeScript to define string patterns.

```typescript
type MetamaskChainId = `0x${string}`;

// ❌ Error: Type "123" is not assignable to type '0x${string}'
const id: MetamaskChainId = "123";

// ✅
const id: MetamaskChainId = "0x123";
```

Introduced in TypeScript 4.1 (I know, it’s been a while, but sometimes I also discover features that have been around for some time 😉), template literal types allow us to create more specific type definitions.

In the snippet above, `MetamaskChainId` is a type that expects a string starting with "0x".

While TypeScript will check this at compile time, it's important to remember that these checks don't apply at runtime. This feature isn't a bulletproof solution for type safety but is incredibly useful for making the code more descriptive and guiding its use correctly, especially since I'm using an IDE with IntelliSense.

---

## TIL: Accessing WASM Metadata in Node.js

This month, I stumbled upon something quite useful: how to read a canister’s WebAssembly (WASM) module’s metadata section using Node.js.

This discovery was not just about the cool factor; it also had practical applications in the new Serverless Function feature of **[Juno](https://juno.build/)**, where understanding the extensions made to smart contracts by developers can be crucial for the platform.

To access this metadata, the process is straightforward:

```javascript
const { readFileSync } = require("node:fs");

const wasmBuffer = readFileSync("/path/to/satellite.wasm");
const mod = new WebAssembly.Module(wasmBuffer);

const metadata = WebAssembly.Module.customSections(mod, "icp:public juno:build");

const decoder = new TextDecoder();
const buildType = decoder.decode(metadata[0]);

console.log(buildType);
```

To access the metadata of our WebAssembly (WASM), we examine its `customSections`.

A WASM module comprises various sections, the majority of which adhere to the specifications outlined in the WASM specification. However, developers have the flexibility to include custom sections that are disregarded during the standard validation process.

These custom sections serve as a means to embed supplementary data within WASM modules. For instance, the name custom section enables developers to assign names to all the functions and locals within the module, akin to “symbols” in a native build.

In this context, we instantiate a `WebAssembly.Module` using a locally loaded WASM file. Subsequently, we extract the `customSections` and focus on the first one, given the absence of additional metadata in this example.

---

This marks the debut of a blog series blending the brevity of “TIL” tweets. Hope it was a nice short read (for those who are still reading blog posts 😉).

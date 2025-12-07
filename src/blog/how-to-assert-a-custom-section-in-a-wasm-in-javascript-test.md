---
path: "/blog/how-to-assert-a-custom-section-in-a-wasm-in-javascript-test"
date: "2025-04-14"
title: "How to Assert a Custom Section in a WASM (in JavaScript)"
description: "Read and assert a WebAssembly module metadata using Vitest, a quick recipe."
tags: "#wasm #vitest #test #metadata"
image: "https://daviddalbusco.com/assets/images/1*U-RfGMLu6r_dkcD1FveD_A.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*U-RfGMLu6r_dkcD1FveD_A.jpeg)

> Photo by [Pawel Czerwinski](https://unsplash.com/fr/@pawel_czerwinski?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/fr/photos/motif-darriere-plan-HypiDneHQsQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

---

Not sure if this blog post will ever be read or useful to anyone — feels like one of those super ultra-niche things. And to be honest, it’s nothing groundbreaking either. If you check MDN or ask your favorite AI, you’ll probably figure it out pretty quickly.

But hey, I felt like sharing anyway.

On [Juno](https://juno.build/), every container — or smart contract, or idenpendent microservice (call them what you want) — is a WebAssembly module running on the Internet Computer. While I was building support for serverless functions written in TypeScript, I ran into a need, keeping track of the version of each deployed function written by the developers.

After a few iterations, I landed on an approach where each module gets a pseudo-`package.json` embedded as a custom section in the WASM binary. This way, any part of the ecosystem — whether tooling or the platform itself — can read the module's version and dependencies.

Once the feature was working, I knew I needed a test for it. Embedding and exposing that metadata is pretty critical. So I wrote a Vitest assertion to validate the metadata, and figured I’d share the solution with you here.

---

## The High-Level Idea

I needed to make sure my WASM modules actually include the custom `juno:package` section I add during build time — and that the metadata inside it is correct.

So I wrote a simple Vitest test that:

1.  Reads the compiled `.wasm` file
2.  Extracts the custom section named `icp:public juno:package`
3.  Parses it as JSON
4.  Asserts the content matches what I expect

Here’s what that looks like:

```typescript
it("should expose public custom section juno:package", async () => {
	const junoPkg = await customSectionJunoPackage({ path: SATELLITE_WASM_PATH });

	expect(junoPkg).toEqual({
		name: "@junobuild/satellite",
		version: readWasmVersion("satellite")
	});
});
```

---

## Reading the Custom Section

The `customSectionJunoPackage()` helper is just a tiny wrapper that calls a more generic `customSection()` function and parses the result as JSON:

```typescript
export const customSectionJunoPackage = async ({ path }) => {
	const section = await customSection({ path, sectionName: "icp:public juno:package" });
	return JSON.parse(section);
};
```

I wrapped the logic in a helper because — who knows — I might need to read other sections in the future. Also, my section name is prefixed with `icp:public` because, according to the spec, custom metadata needs that prefix to be exposed publicly on the network.

That said, nothing fancy. The real work happens inside `customSection()` — that’s where we load the WASM, decompress it (since I gzip it during the build), and extract the actual custom section.

Here’s how that looks:

```typescript
const customSection = async ({
	path,
	sectionName
}: {
	path: string;
	sectionName: string;
}): Promise<string> => {
	// Read WASM
	const buffer = await readFile(path);
	const wasm = await gunzipFile({ source: buffer });

	// Compile a WebAssembly.Module object
	const wasmModule = await WebAssembly.compile(wasm);

	// Read the public custom section
	const pkgSections = WebAssembly.Module.customSections(wasmModule, sectionName);
	expect(pkgSections).toHaveLength(1);

	// Parse content to object
	const [pkgBuffer] = pkgSections;
	return uint8ArrayToString(pkgBuffer);
};
```

Now let’s walk through it step by step.

1.  Read the `.wasm` file

```typescript
import { readFile } from "fs/promises";

const buffer = await readFile(path);
```

Pretty straightforward — this reads the file from disk (either absolute or relative path) and gives us a raw buffer.

2. Decompress it

```typescript
import { gunzipFile } from "@junobuild/cli-tools";

const wasm = await gunzipFile({ source: buffer });
```

Since I gzip the `.wasm` file during the build step (mostly for size reasons), I need to decompress it before I can inspect it. `gunzipFile` is a small helper I use for this — but under the hood, it just relies on the Node.js `zlib` API.

Here’s what it looks like:

```typescript
import { Readable } from "node:stream";
import { createGunzip } from "node:zlib";

export const gunzipFile = async ({ source }: { source: Buffer }): Promise<Buffer> =>
	await new Promise((resolve, reject) => {
		const sourceStream = Readable.from(source);
		const chunks: Uint8Array[] = [];
		const gzip = createGunzip();

		sourceStream.pipe(gzip);
		gzip.on("data", (chunk) => chunks.push(chunk));
		gzip.on("end", () => resolve(Buffer.concat(chunks)));
		gzip.on("error", reject);
	});
```

3. Compile it to a WebAssembly module

```typescript
const wasmModule = await WebAssembly.compile(wasm);
```

This step turns the decompressed binary into an actual `WebAssembly.Module`. This is required because, well, we can’t directly inspect sections from raw bytes — we need a compiled module first ([MDN docs](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/compile_static)).

⚠️ We’re not _instantiating_ the module (i.e., not running it), we’re just compiling it so we can poke around inside.

4. Read the custom section and make sure it exists

```typescript
const pkgSections = WebAssembly.Module.customSections(wasmModule, sectionName);
expect(pkgSections).toHaveLength(1);
```

Here’s where the magic happens.

The `WebAssembly.Module.customSections()` method lets you extract any custom sections by name — in my case, the `icp:public juno:package` key.

Since a WASM module can technically have multiple sections, I get them as an array. That’s why I assert its length to make sure the section is actually there — because if it’s not, something went wrong in the build.

No section? No metadata anyway.

5. Convert the section to a string

```typescript
import { uint8ArrayToString } from "uint8array-extras";

const [pkgBuffer] = pkgSections;
return uint8ArrayToString(pkgBuffer);
```

The section we get is a `ArrayBuffer`, so the last step is just turning it into a string. In my case, that string is JSON, but at this level, we don’t assume anything — just return it as-is.

Later, in `customSectionJunoPackage()`, I parse it with `JSON.parse()`, but this low-level helper could work for any kind of string-based metadata.

For conversion, I use a helper from the [uint8array-extras](https://github.com/sindresorhus/uint8array-extras) library as I already depend on it in the project since I’m using other CLI tools from the same author.

That’s it. No WebAssembly voodoo here. Just basic file I/O, a bit of decompression, and some native JS/WebAssembly APIs doing their thing.

---

## Bonus: Reading the Original Cargo.toml

You might’ve noticed the `readWasmVersion()` function back in the test. That’s there to make sure the version embedded in the WASM’s `juno:package` section is actually the one defined in the original `Cargo.toml`.

Since my build pipeline grabs the version from that file, I want my test to confirm it’s doing the right thing.

Here’s how I read the version from the TOML:

```typescript
import { parse } from "@ltd/j-toml";
import { assertNonNullish } from "@dfinity/utils";

export const readWasmVersion = (segment: string): string => {
	const tomlFile = readFileSync(join(process.cwd(), "src", segment, "Cargo.toml"));

	type Toml = { package: { version: string } } | undefined;

	const result: Toml = parse(tomlFile.toString()) as unknown as Toml;

	const version = result?.package?.version;

	assertNonNullish(version);

	return version;
};
```

I use the [j-toml](https://github.com/LongTengDao/j-toml) library to parse TOML in a way that’s faithful enough to trust when bundling and reading and [assertNonNullish()](https://github.com/dfinity/ic-js/tree/main/packages/utils#gear-assertnonnullish) is just a handy helper I use across the codebase — it throws if the value is `null` or `undefined`.

This way, the test isn’t just checking _if_ the metadata is present — it’s making sure it’s _correct_.

---

## That’s a Wrap

That’s pretty much it. A small test, a bit of metadata, and some light WASM poking. Again, not sure if this will ever be helpful for anyone — or if anyone will even read it — but if you did, hope it was enjoyable.

Cheers,  
David

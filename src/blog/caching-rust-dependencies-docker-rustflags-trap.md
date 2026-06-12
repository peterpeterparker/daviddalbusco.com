---
path: "/blog/caching-rust-dependencies-rustflags-trap"
date: "2026-06-12"
title: "Caching Rust Dependencies: The RUSTFLAGS Trap"
description: "I was looking to speed up CI builds by pre-caching Rust dependencies, but it kept rebuilding everything, until I figured out why."
tags: "#rust #docker #ci #github-actions"
image: "https://daviddalbusco.com/assets/images/richard-horvath-cPccYbPrF-A-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/richard-horvath-cPccYbPrF-A-unsplash.jpg)

> Photo by [Richard Horvath](https://unsplash.com/fr/@ricvath?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/formes-ondulantes-bleues-et-turquoise-cPccYbPrF-A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I maintain Juno's [GitHub Action](https://github.com/junobuild/juno-action), a thin wrapper around a CLI that exposes all its commands and runs inside a Docker container, so developers can build their Rust serverless functions without installing the  toolchain themselves. Every time it ran, Cargo would spend minutes downloading and recompiling dependencies that never change.

The fix seemed obvious: pre-build the dependencies into the Docker image, cache the artifacts, and reuse them at runtime.

So I did that. Set up a dedicated `CARGO_TARGET_DIR`, added a prebuild step to the Dockerfile, rebuilt the image. Ran the action. Should have worked, right? But no, it did not.

After some digging, I found my mistake: `RUSTFLAGS`.

---

## The context

A Juno Rust serverless function is a `lib.rs` crate that contains the developer's code and exposes a few predefined endpoints. Like any crate, it declares its dependencies in `Cargo.toml`, and building it downloads and compiles all of those dependencies first.

The action is a thin wrapper around the CLI, running inside a Docker container. So when a developer runs `functions build` in their CI, those dependencies get pulled and compiled inside the container, every single time.

Since an empty `lib.rs` with the same `Cargo.toml` pulls in the exact same dependencies, I figured I could build that empty crate at image build time, writing the artifacts to the same `CARGO_TARGET_DIR` the CLI uses at runtime. That way, all those dependencies would already be downloaded and compiled by the time the developer's project builds, ready to be reused.

So, I added `CARGO_TARGET_DIR` to the existing image build step and the resulting Dockerfile script looks something like this:

```bash
RUN cd /project \
    && mkdir -p src/lib/src && touch src/lib/src/lib.rs \
    && CARGO_TARGET_DIR=/cache/target \
       RUSTFLAGS='-A deprecated --remap-path-prefix /home/apprunner/.cargo=/cargo -C link-args=-zstack-size=3000000 --cfg getrandom_backend="custom"' \
       cargo build --target wasm32-wasip1 --release --locked
```

At runtime however, the CLI invoked `cargo build` with its own `RUSTFLAGS`:

```javascript
RUSTFLAGS: '--cfg getrandom_backend="custom" -A deprecated',
```

Looked fine, right? I mean same flags, more or less. Except no, Cargo saw them as completely different and recompiled everything.

---

## Why Cargo invalidates the cache

As I learned while debugging the issue, Cargo stores a fingerprint for every compiled artifact. That fingerprint includes the exact `RUSTFLAGS` used during compilation, not just which flags were set, but their exact string, and **in order**.

You can inspect it directly in the file where Cargo stores the metadata about how a crate was compiled (which I wasn't aware of before):

```bash
cat target/wasm32-wasip1/release/.fingerprint/my-crate-abc123/lib-my-crate.json
```

```json
{
	"rustflags": [
		"-A",
		"deprecated",
		"--remap-path-prefix",
		"/home/user/.cargo=/cargo",
		"-C",
		"link-args=-zstack-size=3000000",
		"--cfg",
		"getrandom_backend=\"custom\""
	]
}
```

If the flags at runtime differ: different flags, missing flags, or even the same flags in a different order, Cargo considers the fingerprint invalid and recompiles from scratch.

---

## The fix

If you are still reading this post, I guess you already figured out the fix. Match the `RUSTFLAGS` exactly between the Docker prebuild and the CLI runtime. Same flags, same order.

In my case, the CLI was missing `--remap-path-prefix` and `-C link-args=-zstack-size=3000000`, and the order was different. The fix was to align them:

```javascript
const rustFlags = `-A deprecated --remap-path-prefix /home/apprunner/.cargo=/cargo -C link-args=-zstack-size=3000000 --cfg getrandom_backend="custom"`;
```

After aligning the flags, the pre-built artifacts were reused and build times dropped from 3m45s to 2m45s, a 25% improvement.

---

## The takeaway

If your Cargo dependency cache isn't being reused in CI, check the fingerprint file before assuming the cache layer is broken. The flags need to match exactly. When in doubt, print both sets of flags side by side and compare them character by character.

Until next time!
David

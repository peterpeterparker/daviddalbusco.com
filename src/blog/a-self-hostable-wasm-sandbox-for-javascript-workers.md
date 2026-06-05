---
path: "/blog/a-self-hostable-wasm-sandbox-for-javascript-workers"
date: "2026-06-05"
title: "A Self-Hostable Wasm Sandbox for JavaScript Workers"
description: "A walkthrough of the CLI I built to run JavaScript workers on a VPS without Node.js, Bun, or Docker."
tags: "#webassembly #rust #javascript #typescript"
image: "https://daviddalbusco.com/assets/images/li-zhang-K-DwbsTXliY-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/li-zhang-K-DwbsTXliY-unsplash.jpg)

> Photo by [Li Zhang](https://unsplash.com/fr/@sunx?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/un-fond-abstrait-rouge-et-orange-avec-des-courbes-K-DwbsTXliY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I've been building [Juno](https://github.com/junobuild/juno) for a while, a platform where apps run in some sort of containers. For its authentication, I also built an API with Bun that runs on a VPS. So, needless to say, I like running my own sandboxes.

When I recently tried Cloudflare Workers to build my ["blog to newsletter"](https://github.com/peterpeterparker/blog-to-newsletter-action) action pipeline, something clicked: a single function, sandboxed, stateless, handling HTTP... maybe there is something to experiment here?

I started wondering: could I actually build something similar that runs on a VPS without Node.js, Bun, or even Docker installed on the host?

That experiment is **[Kyushu](https://kyushu.dev)**.

---

## Overview

I already knew JavaScript could run inside Wasm (Juno does exactly that). What I wanted to prove was whether I could build a Wasm binary that runs a JS handler and pair it with an engine that handles HTTP and forwards requests into it.

Turns out both were possible and that's how Kyushu ended up with two parts: a **worker** and a **runner**.

The worker is a Wasm binary that runs your JavaScript. The runner (`kyu run`) is a Rust binary that loads the worker and handles HTTP. That's it.

```
┌─────────────────────────────────────────┐
│                kyu run                  │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │         Wasmtime (host)          │   │
│  │                                  │   │
│  │  ┌────────────────────────────┐  │   │
│  │  │   worker.wasm (sandbox)    │  │   │
│  │  │                            │  │   │
│  │  │  QuickJS + your JS code    │  │   │
│  │  └────────────────────────────┘  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
         ▲                    │
    HTTP request         HTTP response
```

Let's look at each part.

---

## The worker

The core of Kyushu is a WebAssembly component targeting `wasm32-wasip2`. It embeds [QuickJS](https://bellard.org/quickjs/) - a small, embeddable JavaScript engine - via [rquickjs](https://github.com/DelSkayn/rquickjs), a Rust crate that provides safe bindings.

It receives an HTTP request, passes it to a JavaScript handler, and returns a response. The JavaScript itself lives inside the binary too, but we'll get to that.

```
┌─────────────────────────────────────────┐
│            worker.wasm (sandbox)        │
│                                         │
│  HTTP request                           │
│       │                                 │
│       ▼                                 │
│  [ JsRequest ]                          │
│       │                                 │
│       ▼                                 │
│  [ QuickJS / your JS code ]             │
│       │                                 │
│       ▼                                 │
│  [ JsResponse ]                         │
│       │                                 │
│       ▼                                 │
│  HTTP response                          │
└─────────────────────────────────────────┘
```

The worker implements the `wasi:http/incoming-handler` interface from the [WASI HTTP](https://github.com/WebAssembly/wasi-http) spec. When a request comes in, it gets deserialized into a `JsRequest` struct and passed to QuickJS as a plain JavaScript object. The handler runs, returns a `JsResponse`, and the worker serializes it back out.

```rust
pub struct JsRequest {
    pub method: HttpMethod,
    pub url: String,
    pub headers: Option<Vec<(String, String)>>,
    pub body: Option<Body>,
}

impl<'js> IntoJs<'js> for JsRequest {
    fn into_js(self, ctx: &Ctx<'js>) -> JsResult<Value<'js>> {
        let obj = Object::new(ctx.clone())?;

        // Serialize each field as a JS object property

        Ok(obj.into_value())
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Body {
    Text(String),
    Bytes(Vec<u8>),
}

pub struct JsResponse {
    pub status: u16,
    pub body: Option<Body>,
    pub headers: Vec<(String, String)>,
}

impl<'js> FromJs<'js> for JsResponse {
    fn from_js(_ctx: &Ctx<'js>, value: Value<'js>) -> JsResult<Self> {
        let obj = Object::from_value(value)?;

        // Deserialize each field from the JS object returned by the handler

        Ok(Self {
            status,
            body,
            headers,
        })
    }
}
```

The `Body` type handles both text and binary, mapping to `string | ArrayBuffer | Uint8Array` on the JavaScript side.

One thing worth mentioning: the worker also uses the [wasm-rquickjs](https://github.com/nicolo-ribaudo/wasm-rquickjs) polyfills, which provide Node.js-compatible APIs inside the Wasm sandbox - things like `fs`, `path`, `crypto`, and more. This means a surprisingly large amount of npm packages just work.

---

## The runner

Once you have a worker artifact, `kyu run` is what actually serves it. It loads the `.wasm` file, starts an HTTP server using [hyper](https://hyper.rs), and forwards incoming requests into the Wasm sandbox via [Wasmtime](https://wasmtime.io).

Wasmtime is the WebAssembly runtime. It handles the WASI interface implementation - filesystem access, environment variables, stdio - and wires up the `wasi:http/incoming-handler` interface that the worker implements.

The sandbox is configured via `kyushu.run.toml`. Filesystem mounts are explicit - nothing is accessible by default, likewise for the environment variables. The worker can only see what you tell it to see.

```toml
[worker]
wasm = "dist/__kyushu_worker.wasm"
port = 5987

[[mounts]]
host = "./public"
guest = "/public"

[[env]]
key = "API_KEY"
value = "secret"
```

The request flow looks like this:

```
HTTP request
  └── hyper (host)
  └── Wasmtime
        └── wasi:http/incoming-handler
        └── worker.wasm
              └── QuickJS
              └── your fetch() handler
              └── JsResponse
  └── HTTP response
```

---

## The build step

At this point, you might be wondering how the JavaScript ends up inside the `.wasm` file. That's what `kyu build` is for.

When you run this command, two things happen.

First, your TypeScript or JavaScript entry point gets bundled using [Rolldown](https://rolldown.rs).

Second, and this is the interesting part, the bundle gets pre-initialized into the worker using [Wizer](https://github.com/bytecodealliance/wizer).

Wizer is a tool that runs a Wasm module up to a defined initialization point, then snapshots the resulting memory state into a new Wasm binary. In Kyushu's case, that means executing the worker's initialization code - setting up the QuickJS runtime, loading the polyfills, evaluating the JavaScript bundle - and then freezing that state.

The resulting `.wasm` file has your code baked in, the module already evaluated and initialized. When a request arrives, there's no startup overhead. The worker just picks up from where Wizer left off, which likely means a negligible cold start (I still need to do some benchmarking).

Moreover, and this is a part I'm really excited at too, the worker binary ships with the CLI and you never need to install cargo or recompile anything on your end. `kyu build` is just bundling and snapshotting. Makes the tooling lightweight and portable.

```
kyu build
  └── rolldown bundles src/index.ts → bundle.mjs
  └── wizer injects bundle into worker.wasm
        └── QuickJS initializes
        └── polyfills load
        └── your module evaluates
        └── snapshot → dist/__kyushu_worker.wasm
```

---

## The types

To provide a state of the art JS dev experience, I also ship a small npm package: [kyushu-types](https://www.npmjs.com/package/kyushu-types).

It provides TypeScript interfaces for `WorkerRequest`, `WorkerResponse`, and `ExportedHandler`, along with [Zod](https://zod.dev) schemas for runtime validation. The worker validates both the incoming request and the outgoing response at the Wasm boundary, so if your handler returns something unexpected, you get a clear error rather than a silent failure.

```typescript
import type { ExportedHandler } from "kyushu-types";

export default {
	async fetch(request) {
		return {
			status: 200,
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ hello: "world" })
		};
	}
} satisfies ExportedHandler;
```

---

## Shipping it

The worker and CLI have separate release pipelines.

When a new worker version is tagged, a GitHub Action builds the `.wasm` component, publishes it as a GitHub Release artifact, and automatically opens a PR that updates the binary committed in the CLI. That way the worker binary is always versioned and the CLI picks it up on the next CLI release.

For the CLI itself, I used [cargo-dist](https://opensource.axo.dev/cargo-dist/). It generates GitHub Actions workflows that build cross-platform binaries, publish them as GitHub Releases, and produce a shell installer script per release.

---

## The meta bit

The only thing missing was a stable URL that always points to the latest installer. So I needed to set up an alias, that's what `kyushu.dev/install` is for.

This route serves the cargo-dist shell installer script. So when you run:

```bash
curl -fsSL https://kyushu.dev/install | bash
```

You're downloading a file served by a Kyushu worker, running on a VPS.

> I used [Hetzner](https://www.hetzner.com/) here.

But to have this, I also needed a website.

---

## Website

For the documentation (obviously at this point I also had to build one), I developed a [Starlight](https://starlight.astro.build) site, but with a twist: what better dogfooding opportunity than serving kyushu.dev with... Kyushu?

So I wrote a static file server as a Kyushu worker. It reads files from a mounted directory and handles MIME types, brotli compression, HEAD requests, and path aliases. Check out the [source on GitHub](https://github.com/peterpeterparker/kyushu/blob/main/packages/docs/src/server.ts) for the full implementation.

```typescript
import type { ExportedHandler } from "kyushu-types";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import mime from "mime-types";

export default {
	async fetch({ url: requestUrl }) {
		const url = URL.parse(requestUrl);

		if (url === null) {
			return { status: 400, body: "Bad Request" };
		}

		const { pathname } = url;

		const sanitizedPathname = pathname === "/" ? "/index.html" : pathname;
		const filepath = join(process.cwd(), "public", sanitizedPathname);

		try {
			await access(filepath);
		} catch {
			return { status: 404, body: "Not Found" };
		}

		try {
			const file = await readFile(filepath);
			const mimeType = mime.lookup(filepath);

			return {
				status: 200,
				headers: {
					"content-type": typeof mimeType === "string" ? mimeType : "application/octet-stream"
				},
				body: file
			};
		} catch {
			return { status: 500, body: "Internal Server Error" };
		}
	}
} satisfies ExportedHandler;
```

Is that meta enough? When you read the documentation or install Kyushu you are actually using Kyushu 🤪.

---

## What's next

[Kyushu](https://kyushu.dev) is early-stage so not exactly sure what's next. I might use it to build other projects and move away from the experiment stage, or just leave it as is. It will likely depend on the reception of the project, who knows, you might have read these lines and give it a try.

The source is on [GitHub](https://github.com/peterpeterparker/kyushu). Let me know what you think!

Until next time!
David

> **Update:** I already converted my [blog-to-newsletter](https://github.com/peterpeterparker/blog-to-newsletter-worker) pipeline, replacing the Cloudflare Worker with a Kyushu. 😅

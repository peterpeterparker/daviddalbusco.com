---
path: "/blog/a-self-hostable-wasm-sandbox-for-javascript-workers"
date: "2026-06-05"
title: "A Self-Hostable Wasm Sandbox for JavaScript Workers"
description: "A walkthrough of the CLI I built to run JavaScript workers on a VPS without Node.js, Bun, or Docker."
tags: "#webassembly #rust #javascript #typescript #wasm"
image: "https://daviddalbusco.com/assets/images/TODO.jpg"
---

I've been building [Juno](https://github.com/junobuild/juno) for a while, a platform where apps run in some sort of containers. For its authentication, I also built an API with Bun that runs on a VPS. So, needless to say, I like running my own sandboxes.

When I recently tried Cloudflare Workers to build my ["blog to newsletter"](https://github.com/peterpeterparker/blog-to-newsletter-action) action pipeline, something clicked: a single function, sandboxed, handling HTTP, VPS... maybe there is something to experiment here?

I started wondering: could I actually build something similar that runs on a VPS without Node.js, Bun, or even Docker installed on the host?

That experiment is [Kyushu](https://github.com/peterpeterparker/kyushu).

---

## Motivation

When you think about it, in an era where running untrusted or user-defined code safely is becoming a real problem. AI agents, plugins, user logic - all of that needs a sandbox. Having something lightweight and self-hostable for that felt like it could be useful. Or at least interesting to build.

Plus, find it fun to try to avoid Node or Bun and saw an opportunity for learning new skills. Long story short, felt like it was worth experimenting.

---

## Overview

Kyushu has two parts: a **worker** and a **runner**. The worker is a Wasm binary that runs your JavaScript. The runner (`kyu run`) is a Rust binary that loads the worker and handles HTTP. That's it.

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

The idea is simple: the worker is a Wasm binary that knows how to receive an HTTP request, pass it to a JavaScript handler, and return a response. The JavaScript itself lives inside the binary too, but we'll get to that.

The worker implements the `wasi:http/incoming-handler` interface from the [WASI HTTP](https://github.com/WebAssembly/wasi-http) spec. When a request comes in, it gets deserialized into a `JsRequest` struct and passed to QuickJS as a plain JavaScript object. The handler runs, returns a `JsResponse`, and the worker serializes it back out.

```rust
pub struct JsRequest {
    pub method: HttpMethod,
    pub url: String,
    pub headers: Option<Vec<(String, String)>>,
    pub body: Option<Body>,
}

pub struct JsResponse {
    pub status: u16,
    pub body: Option<Body>,
    pub headers: Vec<(String, String)>,
}
```

The `Body` type handles both text and binary, mapping to `string | ArrayBuffer | Uint8Array` on the JavaScript side.

One thing worth mentioning: the worker also uses the [wasm-rquickjs](https://github.com/nicolo-ribaudo/wasm-rquickjs) polyfills, which provide Node.js-compatible APIs inside the Wasm sandbox - things like `fs`, `path`, `crypto`, and more. This means a surprisingly large amount of npm packages just work.

---

## The build step

When you run `kyu build`, two things happen.

First, your TypeScript or JavaScript entry point gets bundled using [Rolldown](https://rolldown.rs). The bundle targets the Node.js platform and ESM format.

Second, and this is the interesting part, the bundle gets pre-initialized into the worker using [Wizer](https://github.com/bytecodealliance/wizer).

Wizer is a tool that runs a Wasm module up to a defined initialization point, then snapshots the resulting memory state into a new Wasm binary. In Kyushu's case, that means executing the worker's initialization code - setting up the QuickJS runtime, loading the polyfills, evaluating the JavaScript bundle - and then freezing that state.

The resulting `.wasm` file has your code baked in, QuickJS already initialized, the module already evaluated. When a request arrives, there's no startup overhead. The worker just picks up from where Wizer left off.

Which is really cool because that way, the worker binary ships with the CLI and you never need to install cargo or recompile anything on your end. `kyu build` is just bundling and snapshotting. Makes the tooling lightweight and portable.

The bundle gets injected via a custom host import: `kyushu:worker/bundle#get-bundle`. During the Wizer pre-initialization phase, the CLI provides this import, passing the bundle string to the worker. After snapshotting, the bundle is frozen in the Wasm memory - no external files needed at runtime.

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

## The runner

`kyu run` loads the built `.wasm` file and starts an HTTP server using [hyper](https://hyper.rs). When a request comes in, it gets forwarded into the Wasm sandbox via [Wasmtime](https://wasmtime.io).

Wasmtime is the WebAssembly runtime. It handles the WASI interface implementation - filesystem access, environment variables, stdio - and wires up the `wasi:http/incoming-handler` interface that the worker implements.

The sandbox is configured via `kyushu.run.toml`. Filesystem mounts are explicit - nothing is accessible by default. Environment variables are explicitly listed. The worker can only see what you tell it to see.

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

## The types

To make the developer experience reasonable, Kyushu ships a small npm package: [kyushu-types](https://www.npmjs.com/package/kyushu-types).

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

The only thing missing was a stable URL that always points to the latest installer. So I needed to set up an alias and that's what brings us to the next part: providing `kyushu.dev/install`.

---

## The meta bit

`kyushu.dev` is served by Kyushu itself.

The website is a static file server written as a Kyushu worker. It reads files from a mounted `public/` directory, detects MIME types using [file-type](https://github.com/sindresorhus/file-type), and serves them.

```typescript
import type { ExportedHandler } from "kyushu-types";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { fileTypeFromBuffer } from "file-type";

const CUSTOM_MIME_TYPES: Record<string, string> = {
	"/install": "text/x-shellscript"
};

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
			const fileType = await fileTypeFromBuffer(file);

			return {
				status: 200,
				headers: {
					"content-type":
						fileType?.mime ?? CUSTOM_MIME_TYPES[sanitizedPathname] ?? "application/octet-stream"
				},
				body: file
			};
		} catch (err: unknown) {
			console.error(err);
			return { status: 500, body: "Internal Server Error" };
		}
	}
} satisfies ExportedHandler;
```

The `/install` route serves the cargo-dist shell installer script. So when you run:

```bash
curl -fsSL https://kyushu.dev/install | bash
```

You're downloading a file served by a Kyushu worker, running on a VPS.

> I used [Hetzner](https://www.hetzner.com/) here.

---

## What's next

Kyushu is early-stage so not exactly sure what's next. I might use it to build other projects and move away from the experiment stage, or just leave it as is. It will likely depend on the reception of the project, who knows, you might have read these lines and give it a try.

The source is on [GitHub](https://github.com/peterpeterparker/kyushu). Let me know what you think!

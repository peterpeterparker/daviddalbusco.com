---
title: "Kyushu"
description: "A self-hostable WebAssembly sandbox for JavaScript workers."
type: "play"
status: "experiment"
order: "1"
---

# Kyushu

I built this experiment after giving a try to Cloudflare Workers. I thought: what if I replicated the concept, a single secure function, sandboxed, handling HTTP, but that can run on a VPS or anywhere without Node.js, Bun, or Docker.

In an era where running untrusted or user-defined code safely is becoming a real problem - AI agents, plugins, user logic - all of that needs a sandbox. Having something lightweight and self-hostable for it also felt like it could be useful.

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

Both used together run JavaScript in a sandbox, isolated from the host filesystem and environment except for what is explicitly configured.

Thanks to the polyfills, the worker supports a wide range of Node.js APIs out of the box - serve static files, read the filesystem, call external services, and more.

---

## Fact sheet

**Website:** [Kyushu](https://kyushu.dev)

**Technology:** [Rust](https://www.rust-lang.org/), [TypeScript](https://www.typescriptlang.org/) and [WebAssembly](https://webassembly.org/)

---

## Open source

This project is open source and available on [GitHub](https://github.com/peterpeterparker/kyushu)

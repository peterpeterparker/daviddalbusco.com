---
path: "/blog/yet-another-web-analytics"
date: "2026-06-22"
title: "Yet Another Web Analytics"
description: "A deep dive into yawa, a self-hosted analytics platform I built with an MCP instead of a UI."
tags: "#analytics #mcp #typescript #bun #duckdb"
image: "https://daviddalbusco.com/assets/images/li-zhang-K-DwbsTXliY-unsplash.jpg"
---

I've been building [Juno](https://github.com/junobuild/juno) for a few years, a platform I ultimately deprecated recently. As a result, I needed to move my projects away from it, including the analytics of my own website, which were baked into the platform.

So I looked around at what was out there that matched my requirements (privacy-friendly, self-hosted, open-source, not sloppy, etc.), found a few good options, but ultimately thought: why not build my own web analytics, again 😅. After all, I already had the knowledge and could likely reuse some of my code.

I gave it some thought but honestly was still hesitant, until a second motivation came into play: what if I explored a new UX paradigm? What if instead of building a UI, I would solely rely on an LLM (Claude Code or else) to query my analytics in plain language (also known as "frenglish" in my case).

The result is **[yet another web analytics](https://yetanotherwebanalytics.dev)** (shortened yawa by the cool kids, meaning me), a self-hostable, open-source, no cookies, no GDPR consent, web analytics solution.

---

## How it works

Your **app or website** sends analytics through a lightweight JavaScript library (`yawa-tracker`) that collects page views, custom events, and Web Vitals.

On **your self-hosted server**, a Docker container runs an API that receives the events and stores them in an embedded [DuckDB](https://duckdb.org) database. It also exposes 26+ analytics tools over the [Model Context Protocol (MCP)](https://modelcontextprotocol.io).

Finally, connect your **MCP client** (Claude Code, Codex, or any compatible client) to your endpoint and query your data in plain language.

In practice, that last step looks like this:

```
❯ What are my top pages this week?

• Fetching your site ID and top pages for this week.

  Called fluster-analytics 2 times

• Here are your top 10 pages on daviddalbusco.com this week (Jun 15–22):

┌───────────────────────────────────────────────────────────────┬──────────┬───────────┐
│                             Page                              │ Visitors │ Pageviews │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ / (home)                                                      │ 72       │ 84        │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ /blog/making-your-website-ai-ready                            │ 53       │ 59        │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ /blog/                                                        │ 14       │ 14        │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ /blog/automating-newsletter-claude-telegram-cloudflare-worker │ 10       │ 11        │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ /blog/making-your-website-ai-ready/                           │ 10       │ 11        │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ /blog/better-type-safety-in-svelte-guard-components           │ 6        │ 6         │
├───────────────────────────────────────────────────────────────┼──────────┼───────────┤
│ /blog/serving-local-assets-with-bun                           │ 6        │ 6         │
└───────────────────────────────────────────────────────────────┴──────────┴───────────┘

The "Making your website AI-ready" post is clearly the standout this week with 53 visitors — well ahead of everything else after the homepage.
```

No dashboard. No login (though obviously access is restricted via bearer token). Just a question and an answer (and a few tokens spent, nothing is perfect).

---

## Architecture

One might argue I overengineered it, to which I would answer: I build tools that aim to be maintainable. So even for a side project, I gave the repo a proper structure and split it into focused packages with clear separation of concerns.

For example, the database layer is intentionally isolated. If I ever swap [Bun](https://bun.sh) or the [Hono](https://hono.dev) API engine, I won't have to rewrite the entire data layer.

- `app` - the server with two sub-apps: a public API (`/events/*`, `/mcp`) for collecting events and providing analytics data, and an internal API available solely within the container (see next chapter)
- `cli` - the admin CLI for token and site management
- `db` - DuckDB instance management, queries, and migrations (yes, I had to write that part too)
- `schema` - shared Zod schemas and types
- `common` - shared utilities (`Result`, `Option`, error helpers)
- `tracker` - the JavaScript library for your frontend, published to npm

At the root of the repo there is the traditional zillion of configuration files any project requires nowadays, plus the Dockerfile used to bundle and publish the image to Docker Hub.

---

## Interesting bits

Most of the implementation was straightforward, and I'll be honest, I also used an LLM to help generate repetitive patterns under my supervision, I'm not that much of a caveman. But there were a few challenges and interesting gotchas I thought, or I hope, are worth sharing.

---- TODO ----

### The CLI and the internal API

One thing I found elegant: the CLI does not talk to the database directly. Instead, it talks to a second Hono app running on port 9999, bound to `127.0.0.1` only, never exposed outside the container.

This keeps the CLI stateless. It just fires HTTP requests. The server handles the DB. And since the internal API runs inside the same process as the public API, it shares the same database connection - no connection pooling, no coordination, just one DuckDB instance.

```
yawa-cli → POST http://localhost:9999/tokens → yawa-app (internal)
                                                      → DuckDB
```

### DB migrations

DuckDB does not ship with a migration tool, so I wrote one. On startup, `openDb` creates the database directory, runs any pending migrations in order, and records each applied migration in a `yawa_admin.migrations` table. It is small but enough for the use case.

```ts
const dbResult = await openDb({ path: YAWA_DATA_DIR });
```

Migrations live as plain SQL files. Nothing fancy. It works.

### Session hashing without cookies

For privacy-friendly visitor counting, I looked at how [Umami](https://umami.is) does it. The approach is to hash a combination of site ID, IP address, user agent, and a daily salt into a deterministic session ID. Same visitor, same day, same session. No cookie required.

```ts
const { hash: salt } = hash({ input: startOfDay(new Date()).toISOString() });
const { hash: sessionHash } = hash({
	input: `${site_id}|${ip}|${user_agent}|${salt}|${secret}`
});
const sessionId = Bun.randomUUIDv5(sessionHash, "dns");
```

The salt rotates daily so sessions do not persist across days. The secret (`YAWA_SESSION_SECRET`) adds an extra layer so the hash cannot be reverse-engineered. If the secret is not set, it falls back to random UUIDs - less accurate visitor counting, but the app still works.

### DuckDB in Docker

This one was annoying. `bun build --compile` produces a single binary, which is great for deployment. But DuckDB uses native `.node` bindings, and the bundler tries to resolve all platform variants at build time - darwin, linux, win32, arm64, x64, musl.

The fix was a small build script that detects the current platform and marks every other platform's bindings as external:

```ts
// Building DuckDB with Bun does not work out of the box.
// See https://github.com/duckdb/duckdb-node-neo/issues/231

const platform = os.platform();
const arch = os.arch();

const current = `@duckdb/node-bindings-${
	platform === "win32" ? "win32" : platform === "darwin" ? "darwin" : "linux"
}-${arch === "x64" ? "x64" : "arm64"}`;

const external = duckdbPlatformBindings.filter((binding) => binding !== current);

await Bun.build({
	entrypoints: ["./src/index.ts"],
	compile: { outfile: "./build/app" },
	target: "bun",
	minify: true,
	external
});
```

Since `oven/bun` (the Docker base image) is Debian-based, musl is not a concern. The binary runs fine with the correct Linux binding present in `node_modules/.bun`, which gets copied into the release image.

### The MCP Accept header bug

Claude Code was silently failing to connect to the MCP server. After some digging, I found a known bug: Claude Code omits the `Accept: application/json, text/event-stream` header required by the Streamable HTTP spec. The `@hono/mcp` middleware was returning 406, which Claude Code misinterpreted as an auth failure.

The fix was a small middleware that patches the header before auth runs:

```ts
// Workaround for Claude Code omitting the Accept header.
// See: https://github.com/anthropics/claude-code/issues/42470
export const patchAcceptHeaderMiddleware = createMiddleware(async (c, next) => {
	const accept = c.req.header("Accept") ?? "";
	if (!accept.includes("application/json") || !accept.includes("text/event-stream")) {
		c.req.raw = new Request(c.req.raw, {
			headers: new Headers([
				...Array.from(c.req.raw.headers.entries()),
				["Accept", "application/json, text/event-stream"]
			])
		});
	}
	await next();
});
```

This has since been fixed in `@hono/mcp`, but the middleware stays as a belt-and-suspenders guard.

---

## A real session

Here is what querying yawa actually looks like. After connecting Claude Code to the MCP server:

```
List my analytics sites
> You have one registered site: localhost (active), ID: 019ed077-...

Were there any tracked events on my site this week?
> Yes, one tracked event this week on localhost:
> hello — 4 times, 4 unique visitors

Show me web vitals summary for localhost this month
> LCP: avg 1234ms, p75 1456ms, p90 1789ms (good)
> CLS: avg 0.02, p75 0.03, p90 0.04 (good)
```

It just works. And because the MCP tools return structured data with `outputSchema`, Claude understands the shape of the response without guessing.

---

## Conclusion

yawa is something I built for myself. My requirements are simple: page views, top pages, referrers, Web Vitals, custom events. I do not plan to implement features like user journeys or funnels because I do not need them personally, and other solutions handle that well.

If you want to try it: the source is on [GitHub](https://github.com/peterpeterparker/yawa) and the Docker image is on Docker Hub.

If you want features I have not built, feel free to contribute - or [hire me](https://daviddalbusco.com) if you need something specific.

Until next time!
David

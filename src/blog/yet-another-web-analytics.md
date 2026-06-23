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

### The CLI and the internal API

[DuckDB only allows a single read-write process to connect to a database file at a time](https://duckdb.org/docs/current/connect/concurrency). If the CLI opened the database directly while the server was running, it would hit a file lock error.

The solution is to keep DuckDB exclusively owned by the server process. The CLI never touches the database directly — instead, it talks to a second Hono app running on port 9999, bound to `127.0.0.1` only, never exposed outside the container.

```
yawa-cli → POST http://localhost:9999/tokens → yawa-app (internal) → DuckDB
```

The internal API runs inside the same process as the public API, so they share the same database connection. No locking issues, no coordination needed.

The "internal" part is enforced at the network level. The public API (port 3000) binds to `0.0.0.0` and is exposed through the Docker port mapping. The internal API (port 9999) binds to `127.0.0.1` only and is never mapped in `docker-compose.yml`, so it is only reachable from inside the container. The CLI runs inside the container via `docker exec`, which is the only way to reach it.

```ts
Bun.serve({ port: 3000, fetch: appFetch, hostname: "0.0.0.0" });      // public
Bun.serve({ port: 9999, fetch: internalFetch, hostname: "127.0.0.1" }); // internal only
```

### DB migrations

Tools like Drizzle ORM and Prisma do not support DuckDB yet, so I wrote a small custom migration runner. On startup, `openDb` creates the database directory, runs any pending SQL migrations in order, and records each applied migration in a `yawa_admin.migrations` table.

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

This one took a while to figure out. [DuckDB uses native `.node` bindings](https://github.com/duckdb/duckdb-node-neo/issues/231), which causes multiple issues when bundling with Bun.

The first problem: building locally fails because Bun tries to resolve all platform variants at build time, including Windows bindings that are not installed on macOS.

The second problem: using `bun build --compile` to produce a single binary fails at runtime in Docker with `libduckdb.so: cannot open shared object file`. The native `.so` file simply cannot be embedded in the compiled binary.

The third problem: setting only the OS-specific platform bindings as external is not enough. `@duckdb/node-api` and `@duckdb/node-bindings` themselves must also be external, otherwise the bundled output fails to resolve the native module at runtime.

The solution is to drop `--compile` entirely, use a regular bundle with `outdir`, set all DuckDB packages as external, and copy `node_modules` into the Docker release image:

```ts
const duckdbBindings = ["@duckdb/node-api", "@duckdb/node-bindings"];

const platformSpecificExternals = duckdbPlatformBindings.filter(
  (binding) => binding !== current
);

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./build",
  target: "bun",
  minify: true,
  external: [...duckdbBindings, ...platformSpecificExternals],
});
```

And in the Dockerfile:

```dockerfile
# copy native bindings (e.g. DuckDB) from prod node_modules
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/packages/app/build/index.js ./index.js

CMD ["bun", "index.js"]
```

Since `oven/bun` is Debian-based, musl is not a concern. I also posted [these findings on the DuckDB issue tracker](https://github.com/duckdb/duckdb-node-neo/issues/231) in case they help someone else.

### Handler typing

Hono [recommends against Rails-style controllers](https://hono.dev/docs/guides/best-practices) because extracting handlers into separate functions loses type inference — path params, validated body, and env variables all become untyped `Context`.

For a project with a few routes this is fine, but yawa has two separate apps (public and internal), each with their own middleware-injected env types. Inlining everything would get messy. I wanted named, importable handlers.

The trick, found via [this Stack Overflow answer](https://stackoverflow.com/a/79300489/5404186), is to type the handler with the input schema shape that `zValidator` produces:

```ts
type JsonInputSchema<T extends z.ZodType> = {
  in: { json: z.input<T> };
  out: { json: z.infer<T> };
};

export type DefineHandler<T extends z.ZodType, Env extends ApiEnv = ApiEnv> = (
  context: Context<Env, string, JsonInputSchema<T>>,
) => Promise<Option<Response>>;
```

Given a schema like:

```ts
const CreateSiteRequestSchema = z.object({ hostname: z.string() });
```

A handler becomes:

```ts
export const defineCreateSite: DefineHandler
  typeof CreateSiteRequestSchema
> = async (context) => {
  const { req, var: { db: { connection } } } = context;

  const { hostname } = req.valid("json"); // fully typed

  // ...
};
```

Registered as:

```ts
app.post(
  "/sites",
  zValidator("json", CreateSiteRequestSchema),
  defineCreateSite,
);
```

`req.valid("json")` is fully typed, the env variables are typed, and the handler is cleanly importable. For handlers with no JSON body, `DefineHandler<never>` works as a fallback.

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

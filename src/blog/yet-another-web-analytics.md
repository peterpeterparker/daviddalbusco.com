---
path: "/blog/yet-another-web-analytics"
date: "2026-06-22"
title: "Yet Another Web Analytics"
description: "A deep dive into yawa, a self-hosted analytics platform I built with an MCP instead of a UI."
tags: "#analytics #mcp #typescript #bun #duckdb"
image: "https://daviddalbusco.com/assets/images/boliviainteligente-uiJNYtAbfVU-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/boliviainteligente-uiJNYtAbfVU-unsplash.jpg)

> Photo by [BoliviaInteligente](https://unsplash.com/fr/@boliviainteligente?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/un-fond-abstrait-colore-avec-des-lignes-ondulees-uiJNYtAbfVU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

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

- [app](https://github.com/peterpeterparker/yawa/tree/main/packages/app) - the server with two sub-apps: a public API (`/events/*`, `/mcp`) for collecting events and providing analytics data, and an internal API available solely within the container (see next chapter)
- [cli](https://github.com/peterpeterparker/yawa/tree/main/packages/cli) - the admin CLI for token and site management
- [db](https://github.com/peterpeterparker/yawa/tree/main/packages/db) - DuckDB instance management, queries, and migrations (yes, I had to write that part too)
- [schema](https://github.com/peterpeterparker/yawa/tree/main/packages/schema) - shared Zod schemas and types
- [common](https://github.com/peterpeterparker/yawa/tree/main/packages/common) - shared utilities (`Result`, `Option`, error helpers)
- [tracker](https://github.com/peterpeterparker/yawa/tree/main/packages/tracker) - the JavaScript library for your frontend, published to npm

At the root of the repo there is the traditional zillion of configuration files any project requires nowadays, plus the [Dockerfile](https://github.com/peterpeterparker/yawa/blob/main/Dockerfile.app) used to bundle and publish the image to [Docker Hub](https://hub.docker.com/r/peterpeterparker/yawa).

---

## Interesting bits

Most of the implementation was straightforward, and I'll be honest, I also used an LLM to help generate repetitive patterns under my supervision, I'm not that much of a caveman. But there were a few challenges and interesting gotchas I thought, or I hope, are worth sharing.

### The CLI and the internal API

DuckDB allows only one read-write connection at a time (see [documentation](https://duckdb.org/docs/current/connect/concurrency)). Since the CLI and the server run simultaneously (that's just normal usage), having the CLI open the database directly would cause a file lock error. So I had to figure out a way to work around the limitation.

The solution: don't instantiate the database in the CLI at all. Instead, have it talk to the server, which owns the database exclusively.

```
yawa-cli → POST /tokens → yawa-app → DuckDB
```

That raised another question though: exposing CLI endpoints in the API would open private features to the world. Not great.

That's where the idea of having an internal API came in, one that shares the same process as the public API and by extension the same database connection.

I set up a second Hono app that runs on port 9999 but bound to `127.0.0.1` via `Bun.serve`'s [hostname](https://bun.sh/docs/runtime/http/server#changing-the-port-and-hostname) option. That way, no external requests can reach it. To make this even more explicit, the docs show a `docker-compose.yml` that never maps the port, and a Caddy config that never proxies it.

```
public   → https://yourdomain:3000 → yawa-app (public)   ─┐
                                                          ├→ DuckDB
yawa-cli → http://localhost:9999   → yawa-app (internal) ─┘
```

Since both run together and the CLI accesses it through plain fetch requests, the locking and coordination problem was solved.

```typescript
Bun.serve({ port: 3000, fetch: appFetch, hostname: "0.0.0.0" }); // public
Bun.serve({ port: 9999, fetch: internalFetch, hostname: "127.0.0.1" }); // internal only
```

### DB migrations

Unfortunately, neither Drizzle nor Prisma support DuckDB yet. Since the schema will obviously evolve over time, I had to write a small migration runner myself, which you can find [here](https://github.com/peterpeterparker/yawa/blob/main/packages/db/src/migrate.ts).

The script runs each time the app starts and looks for plain SQL files in a directory, files that create schemas, tables, add new columns, etc.

It then sorts and filters out the files that have already been applied by comparing them against those recorded in the database. To keep track of migrations, I created a table that lists the scripts that were used to terraform it.

It applies the remaining scripts and records them.

Nothing fancy, but it does the job.

### Session hashing without cookies

For privacy-friendly visitor counting, I looked at how [Umami](https://umami.is) does it (e.g. [source](https://github.com/umami-software/umami/blob/c0ea3aefbee7a3429ee2f824b06dc4a9dbe0b7e1/src/app/api/send/route.ts#L311)). The approach is to hash a combination of site ID, IP address, user agent, and a daily salt into a deterministic session ID. Same visitor, same day, same session. No cookie required.

The IP address is extracted from the request headers, checking a list of known CDN headers and notably `x-forwarded-for` included by [Caddy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy#defaults)), the reverse-proxy I used to expose the API with a custom domain.

The session ID itself is computed like this:

```typescript
import { CryptoHasher } from "bun";

const hash = ({ input }: { input: string }): { hash: string } => ({
	hash: new CryptoHasher("sha256").update(input).digest("hex")
});

const { hash: salt } = hash({ input: startOfDay(new Date()).toISOString() });

const { hash: sessionHash } = hash({
	input: `${site_id}|${ip}|${user_agent}|${salt}|${sessionSecret}`
});

const sessionId = Bun.randomUUIDv5(sessionHash, "dns");
```

The salt rotates daily so sessions do not persist across days. The secret (`YAWA_SESSION_SECRET`) adds an extra layer so the hash cannot be reverse-engineered. If not set, it falls back to random UUIDs, which means less accurate visitor counting, but the app still works. Handy for development.

From an architecture point of view, both the IP and session ID are injected into the request context via middlewares, so route handlers never have to extract them manually, and errors are handled before the handler is ever reached.

For example:

```typescript
export const extractIpMiddleware = createMiddleware<AnalyticsApiEnv>(async (context, next) => {
	const {
		req: {
			raw: { headers }
		}
	} = context;

	context.set("ip", getIp({ headers }));

	await next();
});
```

### Bun and Docker issue with DuckDB bindings

This one took a while to figure out. DuckDB uses native `.node` bindings, which causes multiple issues when bundling with Bun and run in Docker. I ended up posting my findings on the [issue](https://github.com/duckdb/duckdb-node-neo/issues/231) tracker, but here's the summary.

**1. Building locally fails** because Bun tries to resolve all platform variants at build time, including Windows bindings not installed on my macOS. The fix is to mark every binding that doesn't match the current platform as external.

**2. Using `--compile` fails at runtime in Docker** with `libduckdb.so: cannot open shared object file`. The native `.so` simply cannot be embedded in the compiled binary. The only solution was to drop `--compile` entirely.

**3. Only marking platform-specific bindings as external is not enough.** `@duckdb/node-api` and `@duckdb/node-bindings` themselves must also be external, otherwise the bundled output fails to resolve the native module at runtime.

**4. In a monorepo, DuckDB must be a root dependency.** If it lives only in a workspace package, Docker won't resolve the bindings correctly.

In other words, I needed a custom build script for Bun:

```typescript
import os from "node:os";

// Building duckdb with Bun does not work.
// see https://github.com/duckdb/duckdb-node-neo/issues/231

const platform = os.platform();
const arch = os.arch();

// https://github.com/duckdb/duckdb-node-neo#documentation
const duckdbPlatformBindings = [
	"@duckdb/node-bindings-darwin-arm64",
	"@duckdb/node-bindings-darwin-x64",
	"@duckdb/node-bindings-linux-arm64",
	"@duckdb/node-bindings-linux-arm64-musl",
	"@duckdb/node-bindings-linux-x64",
	"@duckdb/node-bindings-linux-x64-musl",
	"@duckdb/node-bindings-win32-arm64",
	"@duckdb/node-bindings-win32-x64"
];

// We need to set all bindings as external and Bun should not use the --compile option.
// Furthermore, the node_modules need to be copied in Docker.
const duckdbBindings = ["@duckdb/node-api", "@duckdb/node-bindings"];

// oven/bun is Debian-based so musl is not needed in Docker and I develop on Mac.
// If its support is needed in the future, e.g. detect-libc could be used to detect it.
const current = `@duckdb/node-bindings-${platform === "win32" ? "win32" : platform === "darwin" ? "darwin" : "linux"}-${arch === "x64" ? "x64" : "arm64"}`;

const platformSpecificExternals = duckdbPlatformBindings.filter((binding) => binding !== current);

await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./build",
	target: "bun",
	minify: true,
	external: [...duckdbBindings, ...platformSpecificExternals]
});
```

And the relevant Dockerfile snippet:

```dockerfile
...
# build final image
FROM base AS release

# We need to copy native bindings (e.g. DuckDB) from prod node_modules
# otherwise we cannot start the db.
# error: libduckdb.so: cannot open shared object file: No such file or directory
COPY --from=install /temp/prod/node_modules ./node_modules

COPY --from=prerelease /usr/src/app/packages/app/build/index.js ./index.js

...

CMD ["bun", "index.js"]
```

### Handler typing

Hono recommends against [Rails-style controllers](https://hono.dev/docs/guides/best-practices#don-t-make-controllers-when-possible) because extracting handlers into separate functions loses type inference - path params, validated body, and env variables all become untyped `Context`.

For a project with a few routes this is fine, but yawa has two separate apps (public and internal), each with their own middleware-injected env types. Inlining everything would get messy and, generally speaking, I find it cleaner to have separate controllers. Furthermore, it makes testing easier. So I wanted named, importable handlers.

The trick, found via [this Stack Overflow answer](https://stackoverflow.com/a/79300489/5404186), is to type the handler with the input schema shape that `zValidator` produces:

```typescript
type JsonInputSchema<T extends z.ZodType> = {
	in: { json: z.input<T> };
	out: { json: z.infer<T> };
};

export type DefineHandler<T extends z.ZodType> = (
	context: Context<Env, string, JsonInputSchema<T>>
) => Promise<Option<Response>>;
```

Given a schema like:

```typescript
const CreateSiteRequestSchema = z.object({ hostname: z.string() });
```

A handler becomes:

```typescript
export const defineCreateSite: DefineHandler<typeof CreateSiteRequestSchema> = async (context) => {
	const {
		req,
		var: {
			db: { connection }
		}
	} = context;

	const { hostname } = req.valid("json"); // fully typed

	// ...
};
```

Registered as:

```typescript
app.post("/sites", zValidator("json", CreateSiteRequestSchema), defineCreateSite);
```

`req.valid("json")` is fully typed, the env variables are typed, and the handler is cleanly importable. For handlers with no JSON body, `DefineHandler<never>` works as a fallback.

As for the variables injected by middlewares, they can be declared by extending the environment.

```typescript
export type ApiEnv = { Variables: { db: { connection: DbConnection } } };

export type DefineHandler<T extends z.ZodType, Env extends ApiEnv = ApiEnv> = (
	context: Context<Env, string, JsonInputSchema<T>>
) => Promise<Option<Response>>;
```

---

## Conclusion

I'm a bit amazed this all works after only a few days of development. The various issues, from the MCP server setup to the DuckDB build pipeline, were good learning experiences. But what I'm most curious about is the UX. This way of interacting with statistics is genuinely interesting, and even if I still sometimes catch myself thinking "it would be nice to have a dashboard", I'm really curious to see if over time that feeling will disappear.

As for the project itself, I built it for myself but feel free to use it. The source is on [GitHub](https://github.com/peterpeterparker/yawa) and the Docker image is on Docker Hub. I don't plan to add features like user journeys or funnels because I simply don't need them, but feel free to contribute, or [hire me](https://daviddalbusco.com) if you need something more specific.

Until next time!
David

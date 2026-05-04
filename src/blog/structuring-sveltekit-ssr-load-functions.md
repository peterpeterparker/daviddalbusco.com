---
path: "/blog/structuring-sveltekit-ssr-load-functions"
date: "2026-06-01"
title: Structuring SvelteKit SSR Load Functions
description: "An architecture pattern for keeping SvelteKit load functions clean, testable, and free of duplicated auth logic as your app grows."
tags: "#sveltekit #typescript #ssr #webdev #architecture"
image: "https://daviddalbusco.com/assets/images/logan-voss-1QlMVjKbJrY-unsplash.jpg"
---

Most SvelteKit tutorials show you how to write a `+page.server.ts` load function (a server-side function that runs before a page renders and fetches the data it needs), but what happens when you have dozens of them, they all need authentication, and you want to keep things maintainable?

In this post, I'll walk you through an architecture I put together while working on a SvelteKit app. To keep the examples concrete, let's pretend we're building an online pizza shop. 🍕

---

## The Problem

Packing everything into the load function works fine at first:

```ts
// +page.server.ts
export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("app:auth");

	if (!locals.jwt) {
		return { pizzas: undefined };
	}

	const response = await fetch(`${API_URL}/pizzas`, {
		headers: { cookie: `jwt=${locals.jwt}` }
	});

	if (!response.ok) {
		error(500, "Failed to load pizzas");
	}

	return { pizzas: await response.json() };
};
```

As soon as you have ten pages, this falls apart. The `depends` call (which tells SvelteKit to re-run the load function when auth state changes), the JWT guard, and the error handling are copy-pasted everywhere. The fetching logic lives inside the route files, coupling them together and making each one harder to test in isolation. On top of that, not all requests are SSR -- some happen on the client side and don't need the JWT forwarded as a header, so you end up with two flavors of the same API call with nothing enforcing the difference. And when you need to change your auth logic or error handling, you likely have to touch every single load file.

---

## The Architecture

The solution I suggest is a layered structure with clear, distinct responsibilities:

```
src/
  lib/
    api/
      _api.ts             ← base class for all API calls
      _api.ssr.ts         ← SSR-specific base (JWT forwarding)
      pizzas.api.ts      ← browser API
      pizzas.api.ssr.ts  ← SSR API
    services/
      pizzas.services.ts
  main/
    server/
      _server.ts          ← ServerLoader abstract base class
      pizzas.server.ts
  routes/
    pizzas/
      +page.server.ts     ← one-liner
```

The one rule that holds the whole thing together: **route files contain no logic**. They delegate entirely to a server class.

The second: `lib` **contains nothing SvelteKit-specific**. Keeping it that way makes your business logic agnostic of the presentation layer and potentially allows you to switch your UI, design or even framework without too much pain in the future.

---

## The Foundation: hooks.server.ts

Our API (and I'm assuming yours too) requires a JWT to authenticate calls. Once issued after authentication, we can rely on [credentials: 'include'](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials) on the client side, which instructs the browser to embed the cookie automatically. However, on the server side, there is no such API and the cookie has to be read manually to pass the JWT along as an HTTP header.

That's why, to make the JWT easily accessible across the application via `locals` (an object specific to a single request which is available to any route), the first step is setting up a `hooks.server.ts` that runs every time the SvelteKit server receives a [request](https://svelte.dev/docs/kit/web-standards#Fetch-APIs-Request) and extracts it.

```ts
// hooks.server.ts
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) => {
	event.locals.jwt = event.cookies.get("jwt");
	return resolve(event);
};
```

And the type declaration:

```ts
// app.d.ts
declare global {
	namespace App {
		interface Locals {
			jwt: string | undefined;
		}
	}
}
```

---

## Layer 1: The API Split

All APIs generally share common traits. In this case, they all have an `apiUrl` and a `throwError` method to handle exceptions, therefore they can live in a base class.

> Note: I use the `_` prefix for filename as a convention for package-scoped modules that are not meant to be used directly outside their layer.

```ts
// lib/api/_api.ts
export abstract class Api {
	protected readonly apiUrl: string;

	protected constructor({ apiUrl }: { apiUrl: string }) {
		this.apiUrl = apiUrl;
	}

	protected async throwError({
		message,
		response
	}: {
		response: Response;
		message: string;
	}): Promise<never> {
		switch (response.status) {
			case 400:
			case 500: {
				const body = await response.json().catch(() => ({}));
				throw new ApiError(`${message} (${response.status}): ${body.message}`, {
					cause: response
				});
			}
			default:
				throw new ApiError(`${message} (${response.status})`, { cause: response });
		}
	}
}
```

The `throwError` method tries to parse the response body as JSON for known error status codes (400, 500) because our API returns a structured error message in those cases. For anything else, it falls back to just the status code.

As for SSR calls, they share one extra trait: the need to pass the JWT as an HTTP header. Another base class, `ApiSsr`, extends `Api` and takes the JWT at construction time, exposing a `cookieHeader()` helper:

```ts
// lib/api/_api.ssr.ts
export abstract class ApiSsr extends Api {
	readonly #jwt: string;

	protected constructor({ apiUrl, jwt }: { apiUrl: string; jwt: string }) {
		super({ apiUrl });
		this.#jwt = jwt;
	}

	cookieHeader(): { cookie: `jwt=${string}` } {
		return { cookie: `jwt=${this.#jwt}` };
	}
}
```

> Note: I use `.ssr.ts` rather than `.server.ts` - which was my first idea - because it seems that the latter is a globally reserved suffix for SvelteKit.

With those two base classes in place, each resource gets two API classes: one for the browser, one for SSR.

One might argue that a single class could behave differently depending on where it runs. When I implemented the solution, I felt like the explicit separation was cleaner but, fair enough, I would not be opposed to the alternative.

With the base classes in place, a browser API implementation is straightforward:

```ts
// lib/api/pizzas.api.ts
export class ApiPizzas extends Api {
	list = async (): Promise<ListPizzasResponse> => {
		const response = await fetch(`${this.apiUrl}/pizzas`, {
			credentials: "include"
		});

		if (!response.ok) {
			return await this.throwError({ response, message: "Cannot get /pizzas" });
		}

		return ApiPizzasSchema.ListPizzasResponse.parse(await response.json());
	};
}
```

When fetch runs on the server, there is as explained no cookie jar. The JWT has to be forwarded explicitly via the `cookieHeader()` helper:

```ts
// lib/api/pizzas.api.ssr.ts
export class ApiPizzasSsr extends ApiSsr {
	list = async (): Promise<ListPizzasResponse> => {
		const response = await fetch(`${this.apiUrl}/pizzas`, {
			headers: {
				...this.cookieHeader() // → { cookie: `jwt=${this.#jwt}` }
			}
		});

		if (!response.ok) {
			return await this.throwError({ response, message: "Cannot get /pizzas" });
		}

		return ApiPizzasSchema.ListPizzasResponse.parse(await response.json());
	};
}
```

In the above snippets you might have noticed the use of [Zod](https://zod.dev) for schema validation. Parsing the response ensures it matches the expected shape at runtime. Small tip: in this particular project, we used [orval](https://orval.dev) to generate the schemas automatically from the API.

---

## Layer 2: Services

Services sit between the API layer and the server classes. Pure functions, no SvelteKit imports, no `error()` throwing. They call one or more API methods and return a `Result<T>`:

```ts
type Result<T> = { status: "success"; result: T } | { status: "error"; err: unknown };
```

```ts
// lib/services/pizzas.services.ts
export const listPizzas = async ({
	jwt
}: {
	jwt: string;
}): Promise<Result<{ pizzas: Pizza[] }>> => {
	try {
		const api = ApiPizzasSsr.create({ jwt });
		const response = await api.list();
		return { status: "success", result: { pizzas: response.pizzas } };
	} catch (err) {
		return { status: "error", err };
	}
};
```

No framework coupling means you can unit test these by mocking `fetch`, without touching SvelteKit at all.

---

## Layer 3: The ServerLoader

This is where the repetitive stuff lives. `ServerLoader` is an abstract base class that centralises everything every load function needs:

```ts
// main/server/_server.ts
export abstract class ServerLoader {
	readonly #context: string;

	protected constructor({ context }: ServerLoaderInit) {
		this.#context = context;
	}

	protected async _load<T>({
		$event: { depends, locals },
		loaderFn,
		errorFallbackMsg,
		onError
	}: LoadParams<T>): Promise<Option<T>> {
		depends(ReloadIdentifiers.Authentication);

		if (isNullish(locals.jwt)) {
			return undefined;
		}

		const result = await loaderFn({ jwt: locals.jwt });

		if (result.status === "error") {
			this.#logError({ err: result.err });

			if (onError !== undefined) {
				return onError({ err: result.err });
			}

			this.#onError({ err: result.err, errorFallbackMsg });
		}

		return result.result;
	}

	protected async _loadWithSlug<T>({
		$event: { params, ...eventRest },
		loaderWithSlugFn,
		errorFallbackMsgs: { load: errorFallbackMsg, missingSlug: errorMissingSlug }
	}: {
		$event: ServerLoadEvent;
		loaderWithSlugFn: ServerLoaderWithSlugFn<T>;
		errorFallbackMsgs: { load: string; missingSlug: string };
	}): Promise<Option<T>> {
		const { slug } = params;

		if (isEmptyString(slug)) {
			error(404, errorMissingSlug);
		}

		const loaderFn: ServerLoaderFn<T> = async (args) => await loaderWithSlugFn({ slug, ...args });

		return await this._load({
			$event: { params, ...eventRest },
			loaderFn,
			errorFallbackMsg
		});
	}

	#logError({ err }: { err: unknown }) {
		console.error(`[${this.#context}]`, err);
	}

	#onError({ err, errorFallbackMsg }: { err: unknown; errorFallbackMsg: string }): never {
		error(500, err instanceof Error ? err.message : errorFallbackMsg);
	}
}
```

In one place, you get:

- `depends(ReloadIdentifiers.Authentication)` on every load, so the load function re-runs automatically when auth state changes (after login or logout via `invalidate`)
- A JWT guard that returns `undefined` if unauthenticated (no throwing, the UI handles that state)
- Error logging tagged with the `context` string, then a 500 via SvelteKit's `error()`
- `_loadWithSlug` for routes with a dynamic param (extracts the slug, throws 404 if missing, delegates to `_load`)

### The `onError` escape hatch

The `LoadParams` type uses a discriminated union:

```ts
type LoadParams<T> = {
	$event: ServerLoadEvent;
	loaderFn: ServerLoaderFn<T>;
} & (
	| { errorFallbackMsg: string; onError?: never }
	| { onError: (params: { err: unknown }) => undefined; errorFallbackMsg?: never }
);
```

Most loaders use `errorFallbackMsg` and get a 500 on failure. But some data is optional (metrics, sidebar content, anything that shouldn't break the whole page if it's unavailable). Those loaders pass `onError: () => undefined` and return gracefully instead.

---

## Layer 4: Server Classes

Server classes extend `ServerLoader`, pass a `context` string for log tagging, and expose typed public methods:

```ts
// main/server/pizzas.server.ts
export class PizzasServer extends ServerLoader {
	private constructor(init: ServerLoaderInit) {
		super(init);
	}

	static create(): PizzasServer {
		return new PizzasServer({ context: "pizzas" });
	}

	async loadPizzas($event: ServerLoadEvent): Promise<Option<Pick<PagesServerLoad, "pizzas">>> {
		const loaderFn: ServerLoaderFn<Pick<PagesServerLoad, "pizzas">> = async ({ jwt }) =>
			await listPizzas({ jwt });

		return await this._load({
			$event,
			loaderFn,
			errorFallbackMsg: "Unexpected error while loading the pizzas"
		});
	}
}
```

For slug-based routes:

```ts
// main/server/pizza.server.ts
export class PizzaServer extends ServerLoader {
	static create(): PizzaServer {
		return new PizzaServer({ context: "pizza" });
	}

	async loadPizza($event: ServerLoadEvent): Promise<Option<Pick<PagesServerLoad, "pizza">>> {
		const loaderWithSlugFn: ServerLoaderWithSlugFn<Pick<PagesServerLoad, "pizza">> = async ({
			slug: pizzaId,
			...rest
		}) => await loadPizza({ pizzaId, ...rest });

		return await this._loadWithSlug({
			$event,
			loaderWithSlugFn,
			errorFallbackMsgs: {
				load: "Unexpected error while loading the pizza",
				missingSlug: "Pizza cannot be fetched, no pizza ID provided."
			}
		});
	}
}
```

---

## Layer 5: Route Files

With all the logic extracted, route files become one-liners:

```ts
// routes/pizzas/+page.server.ts
export const load: PageServerLoad = ($event) => PizzasServer.create().loadPizzas($event);
```

```ts
// routes/pizzas/[slug]/+page.server.ts
export const load: PageServerLoad = ($event) => PizzaServer.create().loadPizza($event);
```

```ts
// routes/+layout.server.ts
export const load: LayoutServerLoad = ($event) => UsersServer.create().loadUser($event);
```

No logic to audit, no auth handling to trace, no fetch calls buried in a route file. A route file is just a declaration of intent.

---

## Testability

The service layer and the server classes are independently testable.

For services, mock `fetch` and assert on the `Result`:

```ts
it("returns error result on API failure", async () => {
	mockFetch.mockResolvedValueOnce(mockResponse({ status: 503 }));

	const result = await listPizzas({ jwt: "mock-jwt" });

	expect(result.status).toBe("error");
});
```

For server classes, build a minimal mock `ServerLoadEvent` and assert on the outcome:

```ts
it("throws 500 when service fails", async () => {
	mockFetch.mockResolvedValueOnce(mockResponse({ status: 500 }));

	await expect(PizzasServer.create().loadPizzas(mockEvent("mock-jwt"))).rejects.toMatchObject({
		status: 500
	});
});

it("returns undefined when JWT is missing", async () => {
	const result = await PizzasServer.create().loadPizzas(mockEvent(undefined));
	expect(result).toBeUndefined();
});
```

---

## Summary

| Layer                     | Responsibility                            | SvelteKit imports? |
| ------------------------- | ----------------------------------------- | ------------------ |
| `_api.ts` / `_api.ssr.ts` | HTTP, cookie headers, error throwing      | No                 |
| Services                  | Orchestrate API calls, return `Result<T>` | No                 |
| `_server.ts`              | Auth guard, `depends`, error handling     | Yes                |
| Server classes            | Typed load methods, slug extraction       | Yes                |
| Route files               | One-line delegation                       | Yes                |

Zero duplicated auth logic. Clean separation between what belongs to the server and what belongs to the browser. Adding a new authenticated route means writing one new method and one new line in a route file, which is about as boring as it should be.

Until next time!
David

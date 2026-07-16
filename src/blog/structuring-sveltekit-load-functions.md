---
path: "/blog/structuring-sveltekit-load-functions"
date: "2026-07-16"
title: Structuring SvelteKit Load Functions
description: "An architecture for loading data that's isolated, testable, and free of copy-pasted auth logic."
tags: "#webdev #architecture #sveltekit #ssr"
image: "https://daviddalbusco.com/assets/images/jr-korpa-9XngoIpxcEo-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/jr-korpa-9XngoIpxcEo-unsplash.jpg)

> Photo by [Jr Korpa](https://unsplash.com/fr/@jrkorpa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/particules-de-lumiere-rose-neon-et-violette-9XngoIpxcEo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Earlier this year I built a server-side rendered app. I developed it with SvelteKit and dozens of `+page.server.ts` [load functions](https://svelte.dev/docs/kit/load) that run before pages render. They all needed authentication, and keeping things maintainable quickly became a real challenge.

In this post, I'll walk you through the architecture I ended up creating. To keep the examples concrete, let's pretend we're building an online pizza shop. 🍕

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

As soon as you have ten pages, this falls apart.

The [`depends`](https://svelte.dev/docs/kit/@sveltejs-kit#LoadEvent) call (which tells SvelteKit to re-run the load function when auth state changes), the JWT guard, and the error handling are copy-pasted everywhere.

The fetching logic lives inside the route files, coupling them together and making each one harder to test in isolation.

On top of that, not all requests are SSR. Some happen on the client side and don't need the JWT forwarded as a header, so you end up with two flavors of the same API call with nothing enforcing the difference.

And when you need to change your auth logic or error handling, you likely have to touch every single load file.

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

That's why, to make the JWT easily accessible across the application via [`locals`](https://svelte.dev/docs/kit/hooks#Server-hooks-locals) (an object specific to a single request which is available to any route), the first step is setting up a `hooks.server.ts` that runs every time the SvelteKit server receives a [request](https://svelte.dev/docs/kit/web-standards#Fetch-APIs-Request) and extracts it.

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

With the base classes in place, the two API classes serve different purposes. The browser API handles mutations — actions triggered by the user, like creating a pizza:

```ts
// lib/api/pizzas.api.ts
export class ApiPizzas extends Api {
	create = async ({ body }: { body: CreatePizzaBody }): Promise<CreatePizzaResponse> => {
		const response = await fetch(`${this.apiUrl}/pizzas`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: CreatePizzaBodyCodec.decode(body)
		});

		if (!response.ok) {
			return await this.throwError({ response, message: "Cannot post /pizzas" });
		}

		const result = await response.json();

		return CreatePizzaResponse.parse(result);
	};
}
```

The SSR API handles reads — data fetched in load functions before the page renders. As explained, there is no cookie jar on the server, so the JWT has to be forwarded explicitly via the `cookieHeader()` helper:

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

In the above snippets you might have noticed the use of [Zod](https://zod.dev) for schema validation. Parsing the response ensures it matches the expected shape at runtime.

---

## Layer 2: Services

Services sit between the API layer and the page and layout servers. Their role is to act as a proxy that never throws. Instead, they catch errors and return a `Result<T>`, a discriminated union that should be handled by the caller. I find this pattern - really similar to Rust - more expressive and elegant to deal with potential errors.

```ts
type Result<T> = { status: "success"; result: T } | { status: "error"; err: unknown };
```

When there is additional logic to handle, services become more than a proxy, but the contract stays the same.

```ts
// lib/services/pizzas.services.ts
export const listPizzas = async (args: { jwt: string }): Promise<Result<{ pizzas: Pizza[] }>> => {
	try {
		const api = ApiPizzasSsr.create(args);
		const { pizzas } = await api.list();
		return { status: "success", result: { pizzas } };
	} catch (err) {
		return { status: "error", err };
	}
};
```

A service for fetching a single pizza by ID - e.g. `getPizza` - would follow the same pattern, taking an additional `pizzaId` parameter alongside `jwt`.

---

## Layer 3: The ServerLoader

As mentioned in the introduction, the goal is to avoid duplicating logic and repetitive code across every load function used by our routes, respectively the layout and page server. `ServerLoader` is an abstract base class that centralises all of that in one place:

```ts
// main/server/_server.ts
import { error, type ServerLoadEvent } from "@sveltejs/kit";

export abstract class ServerLoader {
	readonly #context: string;

	protected constructor({ context }: { context: string }) {
		this.#context = context;
	}

	protected async _load<T>({
		$event: { depends, locals },
		errorFallbackMsg,
		loaderFn
	}: {
		$event: ServerLoadEvent;
		errorFallbackMsg: string;
		loaderFn: (params: { jwt: string }) => Promise<Result<T>>;
	}): Promise<T | undefined> {
		depends("main:auth");

		if (isNullish(locals.jwt)) {
			return undefined;
		}

		const result = await loaderFn({ jwt: locals.jwt });

		if (result.status === "error") {
			console.error(`[${this.#context}]`, result.err);
			error(500, result.err instanceof Error ? result.err.message : errorFallbackMsg);
		}

		return result.result;
	}

	protected async _loadWithSlug<T>({
		$event: { params, ...eventRest },
		errorFallbackMsgs: { load: errorFallbackMsg, missingSlug: errorMissingSlug },
		loaderWithSlugFn
	}: {
		$event: ServerLoadEvent;
		errorFallbackMsgs: { load: string; missingSlug: string };
		loaderWithSlugFn: (params: { jwt: string; slug: string }) => Promise<Result<T>>;
	}): Promise<T | undefined> {
		const { slug } = params;

		if (isEmptyString(slug)) {
			error(404, errorMissingSlug);
		}

		const loaderFn = async (args: { jwt: string }) => await loaderWithSlugFn({ slug, ...args });

		return await this._load({
			$event: { params, ...eventRest },
			loaderFn,
			errorFallbackMsg
		});
	}
}
```

The class exposes two protected methods. `_load` is the general one, meant to be called with a loader function that hooks into the service layer. `_loadWithSlug` is for dynamic routes where a slug is expected in the URL params.

On error, both rely on SvelteKit's [`error()`](https://svelte.dev/docs/kit/@sveltejs-kit#error) function — a function that never returns — to throw a 404 or 500 with a meaningful message.

Since the application has a sign-in and sign-out flow, every load registers a `depends('main:auth')` dependency. This tells SvelteKit to re-run the load function whenever `invalidate('main:auth')` is called, for example after a successful login or logout.

Lastly, also related to authentication, the JWT guard returns `undefined` early if `locals.jwt` is not set. The UI is responsible for handling the unauthenticated state.

---

## Layer 4: Server Classes

Server classes are the concrete classes that the route files will instantiate. They extend `ServerLoader`, pass a `context` string for log tagging, and expose typed public methods:

```ts
// main/server/pizzas.server.ts
import type { ServerLoadEvent } from "@sveltejs/kit";
import { listPizzas } from "$lib/services/pizzas.services";

export class PizzasServer extends ServerLoader {
	private constructor(init: { context: string }) {
		super(init);
	}

	static create(): PizzasServer {
		return new PizzasServer({ context: "pizzas" });
	}

	async listPizzas($event: ServerLoadEvent): Promise<{ pizzas: Pizza[] } | undefined> {
		return await this._load({
			$event,
			errorFallbackMsg: "Unexpected error while loading the pizzas",
			loaderFn: listPizzas
		});
	}
}
```

For slug-based routes:

```ts
// main/server/pizza.server.ts
import type { ServerLoadEvent } from "@sveltejs/kit";
import { getPizza } from "$lib/services/pizza.services";

export class PizzaServer extends ServerLoader {
	private constructor(init: { context: string }) {
		super(init);
	}

	static create(): PizzaServer {
		return new PizzaServer({ context: "pizza" });
	}

	async getPizza($event: ServerLoadEvent): Promise<{ pizza: Pizza } | undefined> {
		return await this._loadWithSlug({
			$event,
			errorFallbackMsgs: {
				load: "Unexpected error while loading the pizza",
				missingSlug: "Pizza cannot be fetched, no pizza ID provided."
			},
			loaderWithSlugFn: async ({ slug: pizzaId, ...rest }) => await getPizza({ pizzaId, ...rest })
		});
	}
}
```

---

## Layer 5: Route Files

With all the logic extracted, route files become one-liners:

```ts
// routes/pizzas/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ($event) => PizzasServer.create().listPizzas($event);
```

```ts
// routes/pizzas/[slug]/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ($event) => PizzaServer.create().getPizza($event);
```

With this architecture, a route file is just a declaration of intent.

> Note that the same pattern works similarly for `LayoutServerLoad`.

---

## Testability

Because each layer has no dependency on the others, testing is straightforward. The API layer, services, and server classes can all be tested independently by mocking `fetch` globally. The route file test is just a spy confirming delegation to the server class.

---

## Summary

| Layer               | Responsibility                               | SvelteKit imports? |
| ------------------- | -------------------------------------------- | ------------------ |
| `_api.ts`           | HTTP, error throwing                         | No                 |
| `_api.ssr.ts`       | JWT cookie forwarding                        | No                 |
| `pizzas.api.ts`     | Browser mutations (`credentials: 'include'`) | No                 |
| `pizzas.api.ssr.ts` | SSR reads (JWT header)                       | No                 |
| Services            | Proxy API calls, return `Result<T>`          | No                 |
| `_server.ts`        | Auth guard, `depends`, error handling        | Yes                |
| Server classes      | Concrete load methods                        | Yes                |
| Route files         | One-line delegation                          | Yes                |

---

## Conclusion

With this architecture, layers are clearly separated and logic isn't duplicated. Adding a new route means writing one new method and one new line in a route file, which is about as boring as it should be even for your LLM.

Until next time!
David

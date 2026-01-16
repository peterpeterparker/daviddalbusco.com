---
path: "/blog/how-to-type-modularized-handlers-in-elysia"
date: "2026-01-16"
title: How to Type Modularized Handlers in Elysia
description: "A practical journey through typing Elysia handlers once you extract them from inline routes."
tags: "#typescript #elysia #bun #type-safety #web-development #jwt #rest-api #backend"
image: "https://daviddalbusco.com/assets/images/steve-johnson-dl6IqQFFnjM-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/steve-johnson-dl6IqQFFnjM-unsplash.jpg)

> Photo by [Steve Johnson](https://unsplash.com/fr/@steve_j?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/image-generee-par-ordinateur-dun-groupe-de-cubes-dl6IqQFFnjM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

---

I just started using [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/) and really enjoying it so far, but it took me a chunk of today to figure out how to properly type handlers once I started modularizing my code.

If you're hitting the same issue, here's my solution for both standard validation and JWT-authenticated routes.

---

## Validation and Context

If I understand correctly, Elysia's end-to-end type safety comes from the fact that all types are inferred when you define [validation](https://elysiajs.com/essential/validation.html#schema-type). This is absolutely amazing if you follow the ergonomics of chaining all routes.

For example, in the following snippet, the content (`hello`) of the body is validated and inferred. Fantastic.

```typescript
import { Elysia, t } from "elysia";

const app = new Elysia()
	.get(
		"/",
		({ body }) => {
			const { hello } = body; // <- Magical type safety
		},
		{
			body: t.Object({
				hello: t.String()
			})
		}
	)
	.listen(3000);
```

However, if I refactor the snippet to extract its [handler](https://elysiajs.com/essential/handler.html), even in the same module, I lose the types and the body becomes `any`.

```typescript
import { Elysia, t } from "elysia";

// TS7031: Binding element body implicitly has an any type.
const handler = ({ body }) => {
	const { hello } = body;
};

const app = new Elysia()
	.get("/", handler, {
		body: t.Object({
			hello: t.String()
		})
	})
	.listen(3000);
```

One interesting way to solve this issue — provided in this [answer](https://github.com/elysiajs/elysia/issues/95#issuecomment-1715722631) on GitHub — would be to use `typeof` the app on the particular route to declare its type. However, this only works if the handler stays in the same module and refactoring it out would introduce recursive imports.

After digging through issues, I discovered that a `Context` interface can be used to type the handler parameters. However, this doesn't infer the validator types.

```typescript
import { type Context, Elysia, t } from "elysia";

const handler = ({ body }: Context) => {
	// TS2339: Property hello does not exist on type unknown
	const { hello } = body;
};
```

Fortunately, `Context` is generic. I just needed to extract the schema type.

```typescript
import { type Context, Elysia, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

// TS2749: HandlerSchema refers to a value, but is being used as a type here. Did you mean typeof HandlerSchema?
const handler = ({ body }: Context<HandlerSchema>) => {
	const { hello } = body;
};

const app = new Elysia()
	.get("/", handler, {
		body: HandlerSchema
	})
	.listen(3000);
```

The next question was how to infer the type of the schema, as using `typeof` as suggested by my editor didn't work.

```typescript
import { type Context, Elysia, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

const handler = ({ body }: Context<typeof HandlerSchema>) => {
	const { hello } = body;
};

const app = new Elysia()
	// Type {} is missing the following properties from type unknown[]: length, pop, push, concat, and 28 more.
	.get("/", handler, {
		body: HandlerSchema
	})
	.listen(3000);
```

To be honest, I used Claude for this question and discovered that I needed to access the inner `static` property for the type.

```typescript
import { type Context, Elysia, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

type Handler = (typeof HandlerSchema)["static"];

// TS2559: Type { hello: string; } has no properties in common with type RouteSchema
const handler = ({ body }: Context<Handler>) => {
	// TS2339: Property hello does not exist on type unknown
	const { hello } = body;
};
```

Almost there, but the body type was still `unknown` and the generic wasn't correctly applied. After a few minutes of trial and error, I found the simple solution—the `body` key was missing.

```typescript
import { type Context, Elysia, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

type Handler = (typeof HandlerSchema)["static"];

const handler = ({ body }: Context<{ body: Handler }>) => {
	const { hello } = body;
};

const app = new Elysia()
	.get("/", handler, {
		body: HandlerSchema
	})
	.listen(3000);
```

And that's it—a properly typed, modularized handler.

## JWT

Obviously, the fun didn't stop there. Later, I started using the [jwt](https://elysiajs.com/plugins/jwt.html) plugin, which added some complexity. Some type guards were also missing in the documentation.

```typescript
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", async ({ jwt, cookie: { auth } }) => {
		// TS2345: Argument of type unknown is not assignable to parameter of type string | undefined
		const profile = await jwt.verify(auth.value);
	})
);
```

I added the necessary guards:

```typescript
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", async ({ jwt, status, cookie: { auth } }) => {
		if (!auth) {
			return status(401, "Unauthorized");
		}

		if (!auth.value) {
			return status(401, "Unauthorized");
		}

		if (typeof auth.value !== "string") {
			return status(401, "Unauthorized");
		}

		const profile = await jwt.verify(auth.value);
	})
);
```

Then I tried to modularize the handler as before (note: this is a GET request, so there's no body).

```typescript
import { jwt } from "@elysiajs/jwt";
import { type Context, Elysia } from "elysia";

// TS2339: Property jwt does not exist on type
const handler = async ({ jwt, status, cookie: { auth } }: Context) => {
	if (!auth) {
		return status(401, "Unauthorized");
	}

	if (!auth.value) {
		return status(401, "Unauthorized");
	}

	if (typeof auth.value !== "string") {
		return status(401, "Unauthorized");
	}

	const profile = await jwt.verify(auth.value);
};

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", handler)
);
```

To my surprise — though it should have been obvious since I had to install an additional plugin 😅 — `jwt` is not part of the core `Context`.

I spent some time searching through the [repo](https://github.com/elysiajs/elysia-jwt) but didn't find a clear answer. So I decided to extend the `Context` with a custom definition.

```typescript
import { jwt } from "@elysiajs/jwt";
import { type Context, Elysia } from "elysia";

type JwtContext = Context & {
	jwt: {
		sign(payload: string): Promise<string>;
		verify(jwt?: string): Promise<string | false>;
	};
};

const handler = async ({ jwt, status, cookie: { auth } }: JwtContext) => {
	if (!auth) {
		return status(401, "Unauthorized");
	}

	if (!auth.value) {
		return status(401, "Unauthorized");
	}

	if (typeof auth.value !== "string") {
		return status(401, "Unauthorized");
	}

	const profile = await jwt.verify(auth.value);
};

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
		// The types of jwt.sign are incompatible between these types.
		// ...
		// is not assignable to type (payload: string) => Promise<string>
	}).get("/profile", handler)
);
```

This resolved the `jwt` typing in the handler but led to a type mismatch error.

Fortunately, the jwt plugin code is relatively thin. I looked at the actual types for [sign](https://github.com/elysiajs/elysia-jwt/blob/c1ef8846bc6fbeee32ff3edacda8a7f281fc89db/src/index.ts#L240) and [verify](https://github.com/elysiajs/elysia-jwt/blob/c1ef8846bc6fbeee32ff3edacda8a7f281fc89db/src/index.ts#L364) and stripped them down to what I could import.

```typescript
import { jwt, type JWTPayloadInput, type JWTPayloadSpec } from "@elysiajs/jwt";
import { type Context, Elysia } from "elysia";

type JwtContext = Context & {
	jwt: {
		sign(payload: JWTPayloadInput & Record<string, any>): Promise<string>;
		verify(jwt?: string): Promise<(JWTPayloadSpec & Record<string, any>) | false>;
	};
};

const handler = async ({ jwt, status, cookie: { auth } }: JwtContext) => {
	if (!auth) {
		return status(401, "Unauthorized");
	}

	if (!auth.value) {
		return status(401, "Unauthorized");
	}

	if (typeof auth.value !== "string") {
		return status(401, "Unauthorized");
	}

	const profile = await jwt.verify(auth.value);
};

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", handler)
);
```

---

## Putting It All Together

Not five minutes later, I obviously needed to combine both solutions 😄.

```typescript
import { jwt, type JWTPayloadInput, type JWTPayloadSpec } from "@elysiajs/jwt";
import { type Context, Elysia, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

type JwtContext = Context & {
	jwt: {
		sign(payload: JWTPayloadInput & Record<string, any>): Promise<string>;
		verify(jwt?: string): Promise<(JWTPayloadSpec & Record<string, any>) | false>;
	};
};

const handler = async ({ jwt, status, cookie: { auth }, body }: JwtContext) => {
	// TS2339: Property hello does not exist on type unknown
	const { hello } = body;
};

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", handler, {
		body: HandlerSchema
	})
);
```

I added my schema but lost the generic `Context` in the process, so I needed to make `JwtContext` support generics.

```typescript
import { jwt, type JWTPayloadInput, type JWTPayloadSpec } from "@elysiajs/jwt";
import { type Context, Elysia, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

type Handler = (typeof HandlerSchema)["static"];

// TS2344: Type Body does not satisfy the constraint RouteSchema
type JwtContext<Body> = Context<Body> & {
	jwt: {
		sign(payload: JWTPayloadInput & Record<string, any>): Promise<string>;
		verify(jwt?: string): Promise<(JWTPayloadSpec & Record<string, any>) | false>;
	};
};

const handler = async ({ jwt, status, cookie: { auth }, body }: JwtContext<Handler>) => {
	// TS2339: Property hello does not exist on type unknown
	const { hello } = body;
};

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", handler, {
		body: HandlerSchema
	})
);
```

First, I fixed the generic constraint by looking at the parent definition—it needed the `RouteSchema` constraint and a default value.

```typescript
type JwtContext<Body extends RouteSchema = RouteSchema> = Context<Body> & {
	jwt: {
		sign(payload: JWTPayloadInput & Record<string, any>): Promise<string>;
		verify(jwt?: string): Promise<(JWTPayloadSpec & Record<string, any>) | false>;
	};
};

// TS2559: Type { hello: string; } has no properties in common with type RouteSchema
const handler = async ({ jwt, status, cookie: { auth }, body }: JwtContext<Handler>) => {
	// TS2339: Property hello does not exist on type unknown
	const { hello } = body;
};
```

Getting closer. I then realized I was trying to provide the type of my schema for the entire route instead of defining only the body.

```typescript
const handler = async ({ jwt, status, cookie: { auth }, body }: JwtContext<{ body: Handler }>) => {
	const { hello } = body;
};
```

Perfect! This resolved all the issues. One final tweak — renaming the generic parameter from `Body` to `Route` since it represents the entire route schema, not just the body.

```typescript
import { jwt, type JWTPayloadInput, type JWTPayloadSpec } from "@elysiajs/jwt";
import { type Context, Elysia, type RouteSchema, t } from "elysia";

const HandlerSchema = t.Object({
	hello: t.String()
});

type Handler = (typeof HandlerSchema)["static"];

type JwtContext<Route extends RouteSchema = RouteSchema> = Context<Route> & {
	jwt: {
		sign(payload: JWTPayloadInput & Record<string, any>): Promise<string>;
		verify(jwt?: string): Promise<(JWTPayloadSpec & Record<string, any>) | false>;
	};
};

const handler = async ({ jwt, status, cookie: { auth }, body }: JwtContext<{ body: Handler }>) => {
	const { hello } = body;
};

const app = new Elysia().use(
	jwt({
		name: "jwt",
		secret: "yolo"
	}).get("/profile", handler, {
		body: HandlerSchema
	})
);
```

And voilà, problem solved 👨‍🍳.

---

## Conclusion

I've been experimenting with Bun and Elysia recently and really enjoying the experience. The solutions above are working well for my use case, though I'm still searching for one thing: a way to validate objects strictly.

Similar to Zod's strict mode, I'd love something like `t.strictObject()` that rejects additional properties:

```typescript
const app = new Elysia()
	.get("/", handler, {
		// TS2339: Property strictObject does not exist on type
		body: t.strictObject({
			hello: t.String()
		})
	})
	.listen(3000);
```

If you know how to achieve this in Elysia, please reach out!

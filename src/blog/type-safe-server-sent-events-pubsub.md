---
path: "/blog/type-safe-server-sent-events-pubsub"
date: "2026-06-12"
title: "Type-Safe Server-Sent Events Pub/Sub"
description: "A typed singleton wrapper around the browser's EventSource API with discriminated union callbacks."
tags: "#typescript #sse #webdev #zod"
image: "https://daviddalbusco.com/assets/images/richard-horvath-cPccYbPrF-A-unsplash.jpg"
standard_site: "at://did:plc:fxmgj7lnas3ewnc3hmpx2vg6/site.standard.document/3mo37f2j76f2r"
---

![](https://daviddalbusco.com/assets/images/richard-horvath-cPccYbPrF-A-unsplash.jpg)

> Photo by [Richard Horvath](https://unsplash.com/fr/@ricvath?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/formes-ondulantes-bleues-et-turquoise-cPccYbPrF-A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Server-Sent Events ([SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)) - a browser API for receiving a stream of updates from a server over a single HTTP connection - are simple on the surface. Open a connection, listen for messages, done. The tricky part is when multiple parts of your app subscribe to the same stream but care about different event types, and you want TypeScript to know exactly what each subscriber will receive.

This post walks through how I solved that. To keep things concrete, let's pretend we're building a pizza shop dashboard. 🍕

---

## The problem

Our dashboard streams real-time updates from the backend: order status changes and delivery tracking events. Both flow through the same SSE endpoint, but a component showing order status shouldn't have to deal with delivery events and vice versa.

The naive solution is to dump everything into one callback and sort it out at the consumer level. It works, but TypeScript can't help you much. Every subscriber gets `unknown` and you're back to casting.

```typescript
eventSource.onmessage = (event) => {
	const data: unknown = JSON.parse(event.data);

	// Every subscriber gets `unknown`, cast and hope
	if ((data as { type: string }).type === "order") {
		handleOrder(data as OrderEvent);
	}
};
```

What I wanted instead: subscribe with a key that encodes what you care about, and get a callback typed to exactly that payload.

---

## The event key

The first piece is the event key. Rather than stringing together arbitrary identifiers, I used Zod's `z.templateLiteral` to define keys that are both validated at runtime and inferred correctly by TypeScript.

```typescript
import { z } from "zod";

const OrderEventKeySchema = z.templateLiteral([
	z.literal("order"),
	z.literal("#"),
	z.string().uuid()
]);

const DeliveryEventKeySchema = z.templateLiteral([
	z.literal("delivery"),
	z.literal("#"),
	z.string().uuid()
]);

export const EventKeySchema = z.union([OrderEventKeySchema, DeliveryEventKeySchema]);

export type EventKey = z.infer<typeof EventKeySchema>;
// "order#<uuid>" | "delivery#<uuid>"
```

The key is just a string at runtime, but TypeScript and Zod both understand its shape.

---

## The callbacks

Each event type gets its own payload schema and callback shape.

```typescript
const OrderEventSchema = z.strictObject({
	order_id: z.string().uuid(),
	type: z.literal("order"),
	status: z.enum(["received", "preparing", "ready", "picked_up"])
});

const DeliveryEventSchema = z.strictObject({
	delivery_id: z.string().uuid(),
	type: z.literal("delivery"),
	status: z.enum(["on_the_way", "arrived"])
});

const OrderCallbackSchema = z.strictObject({
	key: OrderEventKeySchema,
	callback: z.strictObject({
		onmessage: z.function({ input: z.tuple([OrderEventSchema]) })
	})
});

const DeliveryCallbackSchema = z.strictObject({
	key: DeliveryEventKeySchema,
	callback: z.strictObject({
		onmessage: z.function({ input: z.tuple([DeliveryEventSchema]) })
	})
});

export const EventCallbackSchema = z.discriminatedUnion("key", [
	OrderCallbackSchema,
	DeliveryCallbackSchema
]);
```

The discriminated union on `key` is what makes it work. When you call `subscribe` with a key that starts with `order#`, TypeScript narrows `callback.onmessage` to only accept `OrderEvent`. No casting needed.

---

## The stream

With the types in place, the stream class is mostly plumbing with few things worth watching for that I'll share with you after the code.

```typescript
type Unsubscriber = () => void;

type Result<T> = { status: "success"; result: T } | { status: "error"; err: unknown };

export class PizzaStreamAlreadyConnectingError extends Error {}
export class PizzaStreamAlreadyOpenError extends Error {}
export class PizzaStreamAlreadyClosedError extends Error {}
export class PizzaStreamNotInitializedError extends Error {}
export class PizzaStreamAlreadySubscribedError extends Error {}

const STREAM_URL = `${API_URL}/stream`;

export class PizzaStream {
	static #instance: PizzaStream | undefined;

	readonly #callbacks = new Map<EventKey, z.infer<typeof EventCallbackSchema>>();
	#eventSource: EventSource | undefined;

	private constructor() {}

	static getInstance(): PizzaStream {
		if (this.#instance === undefined) {
			this.#instance = new PizzaStream();
		}
		return this.#instance;
	}

	open(): Result<{ status: "initialized" }> {
		if (this.#eventSource !== undefined && this.#eventSource.readyState !== EventSource.CLOSED) {
			switch (this.#eventSource.readyState) {
				case EventSource.CONNECTING:
					return { status: "error", err: new PizzaStreamAlreadyConnectingError() };
				default:
					return { status: "error", err: new PizzaStreamAlreadyOpenError() };
			}
		}

		this.#eventSource = new EventSource(STREAM_URL, { withCredentials: true });

		this.#eventSource.onerror = ($event) => {
			// For demonstration purposes only. In production, consider notifying the consumer or reconnecting on failure.
			console.error("Unexpected error received while streaming:", $event);
		};

		// If the consumer needs to await the channel being open,
		// use this callback and transform the function into a promise.
		// this.#eventSource.onopen = ($event) => {};

		this.#eventSource.addEventListener("pizza-update", this.#dispatch);

		return { status: "success", result: { status: "initialized" } };
	}

	close(): Result<{ status: "closed" }> {
		if (this.#eventSource === undefined) {
			return { status: "error", err: new PizzaStreamNotInitializedError() };
		}

		if (this.#eventSource.readyState === EventSource.CLOSED) {
			return { status: "error", err: new PizzaStreamAlreadyClosedError() };
		}

		this.#eventSource.close();
		return { status: "success", result: { status: "closed" } };
	}

	// Help TypeScript infer callback types
	subscribe(params: { callback: z.infer<typeof OrderCallbackSchema> }): Result<Unsubscriber>;
	subscribe(params: { callback: z.infer<typeof DeliveryCallbackSchema> }): Result<Unsubscriber>;
	subscribe({ callback }: { callback: z.infer<typeof EventCallbackSchema> }): Result<Unsubscriber> {
		const { key } = callback;

		if (this.#callbacks.has(key)) {
			return {
				status: "error",
				err: new PizzaStreamAlreadySubscribedError("Callback already subscribed.", { cause: key })
			};
		}

		this.#callbacks.set(key, callback);
		return { status: "success", result: () => this.#callbacks.delete(key) };
	}

	#dispatch = ($event: MessageEvent<string | unknown>) => {
		// The backend sends each message as a 2-element tuple
		// [orderEvents[], deliveryEvents[]], in that fixed order (either may be empty)
		// Which we represent with a schema for validation.
		const PizzaEventSchema = z.tuple([z.array(OrderEventSchema), z.array(DeliveryEventSchema)]);

		const parsed =
			$event.data !== undefined && typeof $event.data === "string"
				? PizzaEventSchema.safeParse(JSON.parse($event.data))
				: undefined;

		if (parsed?.success !== true) {
			return;
		}

		const { data } = parsed;

		const [orderEvents, deliveryEvents] = data;

		for (const orderEvent of orderEvents) {
			const key: EventKey = `order#${orderEvent.order_id}`;
			const entry = this.#callbacks.get(key) as z.infer<typeof OrderCallbackSchema> | undefined;
			entry?.callback.onmessage(orderEvent);
		}

		for (const deliveryEvent of deliveryEvents) {
			const key: EventKey = `delivery#${deliveryEvent.delivery_id}`;
			const entry = this.#callbacks.get(key) as z.infer<typeof DeliveryCallbackSchema> | undefined;
			entry?.callback.onmessage(deliveryEvent);
		}
	};
}
```

I used a singleton to keep one connection per app, not one per component. Components subscribe and unsubscribe, but the underlying `EventSource` is shared. The goal is to avoid opening one connection per component and overloading the backend. It's not a guarantee, but it's a good-faith effort on the client side.

The `subscribe` overloads are how TypeScript knows which callback type to expect. The implementation signature accepts the union, but callers get the specific type based on what they pass in.

`Result<T>` instead of throwing makes error handling explicit at the call site. The stream either worked or it didn't, and the caller decides what to do.

Before acting, `open()` and `close()` check the connection's `readyState`. Calling `open()` twice, for example, returns a typed error instead of silently doing nothing.

Finally, rather than looking up a single event, `#dispatch` loops over arrays of order and delivery events, since a single SSE message can batch multiple updates of each type.

---

## Using it in the UI

Rather than wiring up the subscription in every component that needs it, I created a wrapper component that handles the lifecycle and passes the data down to its children. The example below is for orders, but delivery would look fairly similar.

> I used Svelte here, but the same idea applies in any framework. The code I shared above is agnostic.

```javascript
<script lang="ts">
	import { onDestroy, type Snippet } from "svelte";

	interface Props {
		orderId: string | undefined;
		children: Snippet;
	}

	let { orderId, children }: Props = $props();

	let unsubscriber = $state<Unsubscriber | undefined>(undefined);

	$effect(() => {
		if (orderId === undefined) {
			unsubscriber?.();
			return;
		}

		const subscribed = PizzaStream.getInstance().subscribe({
			callback: {
				key: `order#${orderId}`,
				callback: {
					onmessage: (event) => {
						console.log("Order status:", event.status);
					}
				}
			}
		});

		if (subscribed.status === "error") {
			// A subscription error here indicates a code usage issue, not a runtime failure.
			console.warn(subscribed.err);
			return;
		}

		unsubscriber = subscribed.result;
	});

	onDestroy(() => {
		unsubscriber?.();
	});
</script>

{@render children()}
```

And that covers it.

---

## Conclusion

The pattern scales well. Adding a new event type means adding a new schema, a new callback type, and a new overload. But the bigger takeaway is the single streamer for the entire app. Any component can subscribe to what it cares about, unsubscribe when it's done, and share the same underlying connection. No coordination needed, no duplicated setup.

Until next time!
David

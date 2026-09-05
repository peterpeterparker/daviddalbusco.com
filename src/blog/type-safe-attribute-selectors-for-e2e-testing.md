---
path: "/blog/type-safe-attribute-selectors-for-e2e-testing"
date: "2026-08-12"
title: Type-Safe Attribute Selectors for E2E Testing
description: "A small pattern to keep test IDs consistent, typed, and out of production builds."
tags: "#webdev #testing #e2e #typescript"
image: "https://daviddalbusco.com/assets/images/martin-martz-Sjp4w1dYpoc-unsplash.jpg"
standard_site: "at://did:plc:fxmgj7lnas3ewnc3hmpx2vg6/site.standard.document/3msuoy5tgnw2r"
---

![](https://daviddalbusco.com/assets/images/martin-martz-Sjp4w1dYpoc-unsplash.jpg)

> Photo by [Martin Martz](https://unsplash.com/fr/@martz90?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/formes-abstraites-courbes-bleues-et-violettes-Sjp4w1dYpoc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I generally don't rely on the DOM structure nor CSS selectors to target elements for E2E testing purposes. Instead, I bet on test IDs, for stability and readability.

Nothing new here, I assume that's the common best practice nowadays.

However, with great selectors comes great responsibility. There are a few pitfalls that should or could be likely avoided.

For example, I've seen many projects spread loose strings, with no convention, scattered across components. That introduces a lack of consistency, duplication, and a suboptimal DX.

Likewise, I've also seen projects leak those selectors into production. I understand the argument "it can be handy to test on staging", but I personally feel like having those live is just... ugly 😅.

To overcome those issues, I reuse the same pattern in every project where I set up E2E tests with Playwright, meaning: in every project where I build a frontend app. Felt like a good excuse for a new blog post. So, here's my recipe.

> Note: I mention Playwright throughout, but the pattern itself is testing-framework agnostic.

---

## Getting Started

The general idea of my setup is the following: I declare types to structure the IDs (1), list all of those in a constant that's shared by the app and the test suite (2), and I use a utils to avoid leaking them when I don't want to (3). Finally, I wire the IDs into the test suite (4).

---

## 1. The type

The core of it is a template literal type that forces every test ID to follow a `{category}-{action}` shape:

```ts
// test-id.ts
type TestCTAType = "btn" | "link" | "input";

type TestAction = string;

export type TestId = `${TestCTAType}-${TestAction}`;

type TestSuite = string;

export type TestIds = Record<TestSuite, Record<string, TestId>>;
```

`TestCTAType` covers the categories of things I actually test: buttons, links, and input elements. `TestAction` is intentionally loose, just a string, but the template literal still forces every value to start with one of those prefixes.

That constraint is the whole point: it forces whoever adds a new test ID, your AI assistant included, to think in terms of "what kind of element is this" rather than typing whatever string comes to mind. The naming stays structured and predictable across the codebase, without anyone having to remember or enforce a convention manually.

The `TestIds` type is a two-level record: one entry per "suite" (usually a page or feature), each holding named test IDs. That's what lets `testIds.invoices.closeInvoice` read like a sentence instead of a random string.

> Note: Two levels is just my own preference, nothing forces you to stop there. Nesting further, say by sub-feature, would work too, it's just not something I've needed so far.

---

## 2. The shared constant

With the type in place, the actual list of test IDs live in a single constant, one entry per page or feature or whatever grouping that matches your app:

```ts
// test-ids.constants.ts
import { TestIds } from "./test-id";

export const testIds = {
	nav: {
		home: "btn-nav-home",
		more: "btn-nav-more",
		invoices: "btn-nav-invoices"
	},
	invoices: {
		open: "btn-open-export",
		exportInvoice: "btn-export-invoice",
		backupInvoices: "btn-backup-invoices",
		closeInvoice: "btn-close-invoice"
	}
	// ...one entry per page/feature
} as const satisfies TestIds;
```

The `satisfies TestIds` is what does the actual enforcement. Try to add `'toggle-invoice'` (missing a valid prefix) and TypeScript rejects it right there, at declaration time, not when a test mysteriously can't find the element.

---

## 3. Not leaking the IDs

As mentioned in the introduction, my opinion is that test IDs, or rather the related DOM attribute `data-testid`, must not exist in production. I resolve this requirement by conditionally rendering them, using a small utils that takes care of spreading the attribute conditionally:

```ts
// test.utils.ts
import type { TestId } from "./test-id";

export const testId = (testId?: TestId): { ["data-testid"]?: string } => ({
	...(isTest() && testId !== undefined && { "data-testid": testId })
});
```

Instead of attaching plain IDs in the UI components, I always go through the helper:

```tsx
<button {...testId(testIds.invoices.closeInvoice)}>
```

If `isTest()` is false, the spread resolves to an empty object and the attribute simply isn't rendered.

The `testId` parameter itself is optional for convenience reasons. I might use the helper in a component which itself is used by other components, and which might not always require an explicit test ID.

Note that `isTest()` is just a dedicated flag I'm using in this blog post and the app I copied the snippet over from:

```ts
export const isTest = (): boolean => JSON.parse(import.meta.env.VITE_E2E ?? "false") === true;
```

wired to a build script:

```json
"build:e2e": "tsc && VITE_E2E=true vite build",
```

There's no particular rule here, it's just that in this particular app, I decided to run the tests against a pseudo-production build (`pnpm build`) rather than over preview or development mode. Feel free to adapt according to your needs.

---

## 4. Wiring into the test suite

From there, `getByTestId` just works with the same typed values used in the components:

```ts
expect(this.#page.getByTestId(testIds.invoices.closeInvoice)).toBeVisible();
await this.#page.getByTestId(testIds.invoices.closeInvoice).click();
```

Page objects reference `testIds.<suite>.<key>` directly, so there's a single source of truth shared between the app code and the test code. Rename a key, and every usage (component and test) breaks at compile time instead of at runtime.

---

## Conclusion

Nothing groundbreaking I guess but, it's an approach that has proven to be reliable and maintainable across my projects, tested over time. Ping me if you have ideas for improvements.

Until next time!
David

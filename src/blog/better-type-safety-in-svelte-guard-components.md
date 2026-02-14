---
path: "/blog/better-type-safety-in-svelte-guard-components"
date: "2026-02-14"
title: Better Type Safety in Svelte Guard Components
description: "Leveraging snippet parameters to make async data guard components properly type-safe."
tags: "#svelte #typescript #snippets #type-safety #patterns"
image: "https://daviddalbusco.com/assets/images/maxim-berg-ANuuRuCRRAc-unsplash.jpg"
---

![](https://daviddalbusco.com/assets/images/maxim-berg-ANuuRuCRRAc-unsplash.jpg)

> Photo by [Maxim Berg](https://medium.com/r/?url=https%3A%2F%2Funsplash.com%2Ffr%2F%40maxberg%3Futm_source%3Dunsplash%26utm_medium%3Dreferral%26utm_content%3DcreditCopyText) on [Unsplash](https://unsplash.com/fr/photos/un-fond-bleu-et-violet-avec-des-lignes-verticales-ANuuRuCRRAc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

---

I recently discovered a better pattern for guard components in Svelte that solves a minor TypeScript type narrowing issue I'd been working around for some time.

---

## The Problem

In my Svelte apps, I often need to handle data that loads asynchronously on the client side. I use a state pattern: `undefined` means still loading, `null` means nothing found, and an actual value means data is loaded.

To reflect those states visually, for example by displaying a good old spinner until data are fetched followed by fading on to the content or a message informing nothing was found, I use a guard component.

If e.g. let's say I'm loading an object called `Article`, I would be doing something as follows:

```typescript
<script lang="ts">
	import type { Snippet } from 'svelte';
    import Spinner from '$lib/components/ui/Spinner.svelte';
    import type {Article} from "$lib/types/article";

	interface Props {
		article: Article | undefined | null;
		children: Snippet;
	}

	let { article, children }: Props = $props();
</script>

{#if article === undefined}
	<Spinner>Loading...</Spinner>
{:else if article === null}
	<p>Not found.</p>
{:else}
	{@render children()}
{/if}
```

This worked fine, but there was a TypeScript quirk: when I used this component, TypeScript couldn't infer that `article` was guaranteed to be defined when `children` rendered. So I'd still need type assertions in the consuming code.

For example:

```typescript
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Article } from '$lib/types/article';
	import Guard from '$lib/Guard.svelte';
	import { load } from '$lib/services/article.services';

	let article = $state<Article | undefined | null>();

	const init = async () => {
		article = await load();
	};

	onMount(init);
</script>

<Guard {article}>
	{#if article !== undefined && article !== null}
		Loaded: {article.title}
	{/if}
</Guard>
```

Those assertions (`article !== undefined && article !== null`) defeat a bit the whole purpose of having strong types.

---

## The Solution

The solution turned out to be surprisingly simple: use a custom snippet (not children) and pass the loaded value as a parameter.

```typescript
<script lang="ts">
	import type { Snippet } from 'svelte';
    import Spinner from '$lib/components/ui/Spinner.svelte';
    import type {Article} from "$lib/types/article";

	interface Props {
		article: Article | undefined | null;
        content: Snippet<[Article]>;
	}

	let { article, content }: Props = $props();
</script>

{#if article === undefined}
	<Spinner>Loading...</Spinner>
{:else if article === null}
	<p>Not found.</p>
{:else}
	{@render content(article)}
{/if}
```

Which gets implemented by the consumer like:

```typescript
<Guard {article}>
	{#snippet content(article)}
		Loaded: {article.title}
	{/snippet}
</Guard>
```

Now when I use this guard component, I get full type safety.

---

## Why This Works

By changing from `Snippet` to `Snippet<[Article]>` and passing the validated `article` as a parameter, TypeScript finally understands the flow:

1. The guard component checks that `article` is neither `undefined` nor `null`
2. Only then does it render the snippet, passing `article` as a function parameter
3. The consuming code receives a properly typed `Article` object - not `Article | undefined | null`

Because the snippet receives `article` as a parameter only after it passes through the validation checks, TypeScript knows it's safe.

---

## Conclusion

This is one of those small comfort patterns that I really enjoy. It makes my code base cleaner and type safer.

Happy coding ☀️
David

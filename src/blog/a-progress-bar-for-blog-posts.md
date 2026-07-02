---
path: "/blog/a-progress-bar-for-blog-posts"
date: "2026-07-02"
title: A Progress Bar for Blog Posts
description: "Displaying how much of an article is left to read with a small Svelte component."
tags: "#webdev #svelte #javascript #css"
image: "https://daviddalbusco.com/assets/images/and-machines-8gqqtZstztc-unsplash.jpg"
standard_site: "at://did:plc:fxmgj7lnas3ewnc3hmpx2vg6/site.standard.document/3mpnqqtjnkx2c"
---

![](https://daviddalbusco.com/assets/images/and-machines-8gqqtZstztc-unsplash.jpg)

> Photo by [and machines](https://unsplash.com/fr/@and_machines?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/fond-peint-degrade-bleu-avec-une-lueur-rose-8gqqtZstztc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

This morning, after doing my company's accounting and getting upset again at how garbage that software is, I decided I needed an easy, little coding task to chill 😄. So I added a small progress bar to the top of my blog posts. It's a nice little cosmetic win, and I thought I would follow up with a short post to share a couple of beginner friendly details.

> If you scroll this page, you should see a bar at the top fill up as you go, and reach 100% right as you finish reading.

---

## The component

To add this new element to the blog I created a component. I might not reuse it elsewhere, but still, it's always nice to approach composition with agnostic, reusable components. It takes an `anchor` element (the end of the article) as a property, since we are looking to show the progression of the reading, computes this percentage, and renders it in a `<progress>` element pinned at the top.

```html
<script lang="ts">
	let { anchor }: { anchor: HTMLElement } = $props();

	$effect(() => {
		// add and remove scroll listener, see "Why not svelte:window to bind scrollY" below
	});

	let value = $state(0);

	const onscroll = () => {
		// compute % scrolled relative to the anchor, see "The math" below
	};
</script>

<progress {value} max="100"></progress>

<style lang="scss">
	// see "Styling" below
</style>
```

With the scene set, let's look at a few of the details.

---

## Why not svelte:window to bind scrollY

Svelte has a built-in way to bind to `scrollY` ([doc](https://svelte.dev/docs/svelte/svelte-window)).

```javascript
<svelte:window bind:scrollY={y} />
```

AFAIK it doesn't let you pass `passive: true` to the underlying listener. I took a quick look at the source and it doesn't seem to use it either, though I'm not entirely sure. What I do know for sure is that using a passive listener for scroll is generally a performance best practice, even if in this particular case one might argue there isn't much to worry about. That's why I went with a custom event listener instead.

```ts
$effect(() => {
	window.addEventListener("scroll", onscroll, { passive: true });

	return () => {
		window.removeEventListener("scroll", onscroll, false);
	};
});
```

In this effect I add and remove a scroll listener but you might notice a subtlety: `removeEventListener` doesn't pass the same options as `addEventListener`, which is generally required to correctly match and remove a listener. That was my assumption too, but TypeScript warned me those options weren't accepted. I looked into why and it turns out that's expected (see this [issue](https://github.com/microsoft/TypeScript/issues/32912)). Searching further I figured out [MDN's docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal) explain it well: only `capture` matters for removal matching, not `passive`, so passing `false` here is just being explicit about `capture` rather than relying on its default.

---

## The math

It's common to see these bars track the full page scroll, but I wanted it to reflect the reading progress instead. Tracking `scrollY` against the full page height would be wrong here, because my pages have a footer. If I use the full scroll height, the bar never reaches 100% by the time you finish the article, since there's still the footer left to scroll past.

So instead I pass an `anchor` element (the end of the article), and compute how much of the scroll is "left" once you get there:

```javascript
const delta = document.documentElement.scrollHeight - anchor.offsetTop;
const scrollLength = anchor.offsetTop - delta;
const y = (window.scrollY * 100) / scrollLength;
```

`delta` is everything below the anchor (footer included). Subtracting it from `anchor.offsetTop` gives the actual scroll distance that corresponds to "reading the article", so the bar hits 100% right when you reach the end, not somewhere before it because of the footer.

Once I got the percentage of the progression (`y`), I could apply it to the state value of the `progress` element while capping it to avoid overflow.

```javascript
value = Math.min(100, Math.floor(y));
```

---

## Styling

I used a native `<progress>` element instead of a styled `div`. Free accessibility semantics, and it, well, looks like a progress bar. I would have expected `accent-color` to be enough to style it, but it wasn't. I found the solution on [Stack Overflow](https://stackoverflow.com/a/76860350/5404186), which I tailored for my website:

```scss
progress {
	color: var(--color-highlight);
	background: transparent;

	/* Firefox: Filled portion of the progress bar */
	&::-moz-progress-bar {
		background: currentColor;
	}

	/* Chrome & Safari: Unfilled portion of the progress bar */
	&::-webkit-progress-bar {
		background: transparent;
	}

	/* Chrome & Safari: Filled portion of the progress bar */
	&::-webkit-progress-value {
		background: currentColor;
	}
}
```

I set a base `color` and a transparent `background` that the pseudo-elements inherit through `currentColor`, but I still need an explicit `background` on the Chrome/Safari specific pseudo-elements, since neither browser applies the fill by default.

---

## Summary

Long story short, here's the full component:

```html
<script lang="ts">
	interface Props {
		anchor: HTMLElement;
	}

	let { anchor }: Props = $props();

	let value = $state(0);

	const onscroll = () => {
		const delta = document.documentElement.scrollHeight - anchor.offsetTop;
		const scrollLength = anchor.offsetTop - delta;

		const y = (window.scrollY * 100) / scrollLength;
		value = Math.min(100, Math.floor(y));
	};

	$effect(() => {
		window.addEventListener("scroll", onscroll, { passive: true });

		return () => {
			// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener#matching_event_listeners_for_removal
			window.removeEventListener("scroll", onscroll, false);
		};
	});
</script>

<progress {value} max="100"></progress>

<style lang="scss">
	progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 0.25rem;

		z-index: 10;

		appearance: none;
		border: none;
	}

	// Color: https://stackoverflow.com/a/76860350/5404186
	progress {
		color: var(--color-highlight);
		background: transparent;

		/* Firefox: Filled portion of the progress bar */
		&::-moz-progress-bar {
			background: currentColor;
		}

		/* Chrome & Safari: Unfilled portion of the progress bar */
		&::-webkit-progress-bar {
			background: transparent;
		}

		/* Chrome & Safari: Filled portion of the progress bar */
		&::-webkit-progress-value {
			background: currentColor;
		}
	}
</style>
```

---

## Conclusion

Nothing fancy but, it was fun. Feel free to copy/pasta the code or let me know if anything should be improved.

Until next time!
David

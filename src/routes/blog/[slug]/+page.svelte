<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import '../../../theme/_blog.scss';

	import type { PageData } from './$types';
	import Button from '$lib/components/button.svelte';
	import Seo from '$lib/components/seo.svelte';
	import type { BlogMetadata } from '$lib/types/blog';
	import { goto } from '$app/navigation';
	import type { MarkdownData } from '$lib/types/markdown';

	export let data: PageData;

	let post: MarkdownData<BlogMetadata>;
	$: ({ post } = data);

	let slug: string;
	let content: string;
	let metadata: BlogMetadata;

	$: ({ slug, content, metadata } = post);

	$: ({ title, canonical, description, image, date: postDate, tags } = metadata);

	onMount(async () => {
		if (!browser) {
			return;
		}

		const { defineCustomElement } = await import(
			/* @vite-ignore */ '@deckdeckgo/highlight-code/dist/components/deckgo-highlight-code'
		);
		defineCustomElement();
	});

	const navigateBlog = () => goto('/blog');
</script>

<svelte:head>
	<Seo {canonical} {description} {image} {title} url={`/blog/${slug}`} />

	<style>
		body > div:first-child {
			--menu-color: black;
			--section-color: black;
		}
	</style>
</svelte:head>

<main>
	<h1>{title}</h1>
	<h3>{description}</h3>

	<p class="date">
		{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
			new Date(postDate)
		)}
	</p>
	<p>{tags}</p>

	<article>
		{@html content}
	</article>

	<div class="actions">
		<Button action={navigateBlog}>Continue to blog</Button>

		<a
			class="newsletter"
			href="http://eepurl.com/giun5j"
			target="_blank"
			rel="external noopener noreferrer">Subscribe to the newsletter</a
		>
	</div>
</main>

<style lang="scss">
	.date {
		margin: 0;
	}

	h3 {
		font-weight: 400;
		margin-bottom: 1.45rem;
	}

	main {
		max-width: 860px;
		margin: 5.45rem auto;
		padding: 0 2.45rem;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2.45rem;
	}

	.newsletter {
		margin: 0.45rem 0;
		padding: 0.45rem;
		box-shadow: 3px 3px black;
		border: 1px solid black;

		text-decoration: none;
		text-align: center;

		transition:
			color 0.25s ease-out,
			background 0.25s ease-out,
			transform 0.15s ease-out,
			box-shadow 0.15s ease-out;

		&:hover {
			background: var(--color-highlight);
			color: var(--color-highlight-contrast);
		}

		&:active {
			box-shadow: none;
			transform: translateX(3px) translateY(3px);
		}
	}
</style>

<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import type { BlogMetadata } from '$lib/types/blog';
	import type { PageData } from '$lib/types/page';
	import Section from '$lib/components/Section.svelte';
	import Link from '$lib/components/Link.svelte';
	import '../../../theme/_blog.scss';
	import '../../../theme/_code.scss';
	import Progress from '$lib/components/Progress.svelte';
	import { formatDate } from '$lib/utils/date.utils';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let post = $derived<PageData<BlogMetadata>>(data.post);

	let slug = $derived(post.slug);
	let content = $derived(post.content);
	let metadata = $derived(post.metadata);

	let noRobots = $derived(metadata.robots === 'disallow');

	let {
		title,
		canonical,
		description,
		image,
		date: postDate,
		tags,
		standard_site: standardSite
	} = $derived(metadata);

	let anchor = $state<HTMLElement | undefined>(undefined);
</script>

<svelte:head>
	<Seo {canonical} {description} {image} {title} url={`/blog/${slug}`} />

	{#if noRobots}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	{#if standardSite !== undefined && standardSite !== ''}
		<link rel="site.standard.document external" href={standardSite} />
	{/if}

	<style lang="scss">
		@use '../../../theme/_page.scss';

		@include page.light;
	</style>
</svelte:head>

{#if anchor !== undefined}
	<Progress {anchor} />
{/if}

<Section>
	<h1>{title}</h1>
	<h3>{description}</h3>

	<p class="date">{formatDate(postDate)}</p>
	<p>{tags}</p>

	<article>
		{@html content}
	</article>

	<div class="actions" bind:this={anchor}>
		<Link href="/blog">Continue reading</Link>

		<a
			class="newsletter"
			href="http://eepurl.com/iXHDy2"
			target="_blank"
			rel="external noopener noreferrer">Subscribe to my newsletter</a
		>
	</div>
</Section>

<style lang="scss">
	.date {
		margin: 0;
	}

	h3 {
		font-weight: 400;
		margin-bottom: 1.45rem;
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

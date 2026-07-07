<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
	import type { BlogMetadata } from '$lib/blog/types/blog';
	import type { PageData } from '$lib/core/types/page';
	import Section from '$lib/core/components/Section.svelte';
	import '../../../theme/_blog.scss';
	import '../../../theme/_code.scss';
	import Progress from '$lib/core/components/Progress.svelte';
	import { formatDate } from '$lib/core/utils/date.utils';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';

	interface Props {
		data: ServerPageData;
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

<Breadcrumb route={{ title: 'Blog', path: '/blog' }} page={{ title }} />

<Section>
	<h1>{title}</h1>
	<h3>{description}</h3>

	<p class="date">{formatDate(postDate)}</p>
	<p>{tags}</p>

	<article>
		{@html content}
	</article>

	<div class="actions" bind:this={anchor}>
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

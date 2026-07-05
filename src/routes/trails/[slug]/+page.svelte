<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import type { TrailMetadata } from '$lib/types/trail';
	import type { MarkdownData } from '$lib/types/markdown';
	import Section from '$lib/components/Section.svelte';
	import Link from '$lib/components/Link.svelte';
	import '../../../theme/_code.scss';
	import Progress from '$lib/components/Progress.svelte';
	import { formatDate } from '$lib/utils/date.utils';
	import { env } from '$env/dynamic/public';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let post = $derived<MarkdownData<TrailMetadata>>(data.post);

	let slug = $derived(post.slug);
	let content = $derived(post.content);
	let metadata = $derived(post.metadata);

	let {
		title,
		date: trailDate,
	} = $derived(metadata);

	let anchor = $state<HTMLElement | undefined>(undefined);

	let image = $derived(
			metadata.photos[0].replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS)
	);
</script>

<svelte:head>
	<Seo {image} {title} url={`/trails/${slug}`} />

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

	<p class="date">{formatDate(trailDate)}</p>

	<article>
		{@html content}
	</article>

	<div class="actions" bind:this={anchor}>
		<Link href="/trails">Continue to the trails</Link>
	</div>
</Section>

<style lang="scss">
	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2.45rem;
	}
</style>

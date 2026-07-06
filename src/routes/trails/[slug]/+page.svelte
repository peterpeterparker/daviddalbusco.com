<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import type { TrailMetadata } from '$lib/types/trail';
	import type { PageData } from '$lib/types/page';
	import Section from '$lib/components/Section.svelte';
	import Link from '$lib/components/Link.svelte';
	import '../../../theme/_code.scss';
	import Progress from '$lib/components/Progress.svelte';
	import { formatDate } from '$lib/utils/date.utils';
	import { env } from '$env/dynamic/public';
	import type { MapGpxPointId, MapGpxPoints } from '$lib/types/map';
	import { onMount } from 'svelte';
	import { loadTrack } from '$lib/services/tracks.services';
	import Map from '$lib/components/Map.svelte';
	import TrackChart from '$lib/components/TrackChart.svelte';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();

	let trail = $derived<PageData<TrailMetadata>>(data.trail);

	let slug = $derived(trail.slug);
	let content = $derived(trail.content);
	let metadata = $derived(trail.metadata);

	let { title, date: trailDate } = $derived(metadata);

	let anchor = $state<HTMLElement | undefined>(undefined);

	let image = $derived(
		metadata.photos[0].replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS)
	);

	let gpxPoints = $state<MapGpxPoints | undefined | null>(undefined);
	let gpxPointId = $state<MapGpxPointId | undefined>(undefined);

	onMount(async () => {
		const result = await loadTrack(metadata);

		if (result.status === 'error') {
			console.error(result.err);

			gpxPoints = null;
			return;
		}

		gpxPoints = result.result;
	});
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

	<Map points={gpxPoints} selectedPointId={gpxPointId} />

	<TrackChart gpxPoints={gpxPoints ?? []} bind:gpxPointId />

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

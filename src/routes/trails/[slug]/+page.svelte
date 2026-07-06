<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import type { Trail } from '$lib/types/trail';
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
	import TrackStats from '$lib/components/TrackStats.svelte';
	import Sport from '$lib/components/Sport.svelte';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();

	let trail = $derived<PageData<Trail>>(data.trail);

	let slug = $derived(trail.slug);
	let content = $derived(trail.content);
	let metadata = $derived(trail.metadata.metadata);
	let track = $derived(trail.metadata.track);

	let { title, date: trailDate, sport } = $derived(metadata);

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

	<p><Sport {sport} /> {formatDate(trailDate)}</p>

	<article>
		{@html content}
	</article>

	<div class="actions">
		<Link href="/trails">View all trails</Link>
	</div>
</Section>

<section class="trail">
	<Map points={gpxPoints} selectedPointId={gpxPointId} />

	<div class="stats">
		<TrackStats {track} />
	</div>

	<div class="chart">
		<TrackChart gpxPoints={gpxPoints ?? []} bind:gpxPointId />
	</div>

	<div aria-hidden="true" bind:this={anchor}></div>
</section>

<style lang="scss">
	.actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2.45rem;
	}

	section {
		background: transparent;
		border-color: transparent;
		max-width: calc(1078px + 0.25rem + 0.25rem);
	}

	.trail {
		display: flex;
		flex-direction: column;
		gap: 1.75rem;

		padding: 0;

		@media screen and (min-width: 996px) {
			display: grid;
			grid-template-columns: 1fr auto;
			grid-gap: 1rem;

			--map-aspect-ratio: auto;
		}
	}

	.chart,
	.stats {
		background: #fafafa;
		color: black;
	}

	.chart {
		@media screen and (min-width: 996px) {
			grid-column: 1/3;
		}
	}
</style>

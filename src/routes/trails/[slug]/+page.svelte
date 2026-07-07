<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
	import type { Trail } from '$lib/trails/types/trail';
	import type { PageData } from '$lib/core/types/page';
	import Section from '$lib/core/components/Section.svelte';
	import '../../../theme/_code.scss';
	import { formatDate } from '$lib/core/utils/date.utils';
	import type { MapGpxPointId, MapGpxPoints } from '$lib/trails/types/map';
	import { onMount } from 'svelte';
	import { loadTrack } from '$lib/trails/services/tracks.services';
	import Map from '$lib/trails/components/Map.svelte';
	import TrackChart from '$lib/trails/components/TrackChart.svelte';
	import TrackStats from '$lib/trails/components/TrackStats.svelte';
	import Sport from '$lib/trails/components/Sport.svelte';
	import TrailPhotos from '$lib/trails/components/TrailPhotos.svelte';
	import { assetUrl } from '$lib/core/utils/assets.utils';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();

	let trail = $derived<PageData<Trail>>(data.trail);

	let slug = $derived(trail.slug);
	let content = $derived(trail.content);
	let metadata = $derived(trail.metadata.metadata);
	let track = $derived(trail.metadata.track);

	let { title, date: trailDate, sport, photos } = $derived(metadata);

	let image = $derived(assetUrl(photos[0]));

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

<Breadcrumb route={{ title: 'Trails', path: '/trails' }} page={{ title }} />

<Section>
	<h1>{title}</h1>

	<p class="date">{formatDate(trailDate)}</p>
	<p><Sport {sport} /></p>

	<article>
		{@html content}
	</article>
</Section>

<section class="trail">
	<Map points={gpxPoints} selectedPointId={gpxPointId} />

	<div class="stats">
		<TrackStats {track} />
	</div>

	<div class="chart">
		<TrackChart gpxPoints={gpxPoints ?? []} bind:gpxPointId />
	</div>

	<div class="photos">
		<TrailPhotos {photos} />
	</div>
</section>

<style lang="scss">
	.date {
		margin: 0;
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

	.chart,
	.photos {
		@media screen and (min-width: 996px) {
			grid-column: 1/3;
		}
	}
</style>

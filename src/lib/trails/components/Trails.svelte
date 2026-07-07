<script lang="ts">
	import Map from '$lib/trails/components/Map.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { PageDataWithoutContent } from '$lib/types/page';
	import type { Trail as TrailType } from '$lib/trails/types/trail';
	import Trail from '$lib/trails/components/Trail.svelte';
	import type { MapAnnotation } from '$lib/trails/types/map';

	interface Props {
		trails: PageDataWithoutContent<TrailType>[];
	}

	let { trails }: Props = $props();

	let annotations = $derived<MapAnnotation[]>(
		trails.map(
			({
				slug,
				metadata: {
					metadata: { title },
					track: { location }
				}
			}) => ({ title, location, pathname: slug })
		)
	);
</script>

<Section>
	<h2>Trails</h2>

	<p>
		A few years ago I started running in the Alps 🏔️. I'm a hobbyist, so don't expect ultra
		distances, marathon is about as far as I go. Sometimes I run elsewhere too as I bring my passion
		with me when I (rarely) travel. Recently I also got into cycling (and, by extension, becoming a
		mechanic apprentice 😅).
	</p>

	<p>
		These are my trails: the GPX tracks, elevation, photos, and the occasional detour that wasn't
		part of the plan.
	</p>

	<p>
		Most routes I follow are convenient for day trips from Zürich. If you'd like to follow any of
		them and have questions, reach out!
	</p>

	<div class="map">
		<Map {annotations} />
	</div>

	<div class="grid">
		{#each trails as trail (trail.slug)}
			<Trail {trail} />
		{/each}
	</div>
</Section>

<style lang="scss">
	@use '../../../theme/grid';

	.grid {
		margin: 0 0 2.25em;

		--cover-img-border: 0.25rem solid black;

		@include grid.panel;
	}

	.map {
		margin: 0 0 1.45em;
	}
</style>

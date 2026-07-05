<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
	import type { TrailMetadata } from '$lib/types/trail';
	import Trail from '$lib/components/Trail.svelte';
	import type { MapAnnotation } from '$lib/types/map';

	interface Props {
		trails: MarkdownDataWithoutContent<TrailMetadata>[];
	}

	let { trails }: Props = $props();

	let annotations = $derived<MapAnnotation[]>(
		trails.map(({ slug, metadata: { title, location } }) => ({ title, location, pathname: slug }))
	);
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
	<h2>Trails</h2>

	<p>
		I'm a bit of a workaholic, but I've always been relatively sporty. It keeps the balance, I
		guess. A few years ago I started running in the Alps 🏔️. I'm a hobbyist, so don't expect ultra
		distances, marathon is about as far as I go. Sometimes I run elsewhere too as I bring my passion
		with me when I (rarely) travel. Recently I also got into cycling (and, by extension, becoming a
		mechanic apprentice 😅).
	</p>

	<p>
		These are my trails: the GPX tracks, elevation, photos, and the occasional detour that wasn't
		part of the plan.
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
	@use '../../theme/_grid.scss';

	.grid {
		margin: 0 0 2.25em;

		@include grid.panel;
	}

	.map {
		margin: 0 0 1.45em;
	}
</style>

<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	import Section from '$lib/components/Section.svelte';
	import type {MarkdownDataWithoutContent} from "$lib/types/markdown";
	import type {TrailMetadata} from "$lib/types/trail";
	import Trail from "$lib/components/Trail.svelte";

	interface Props {
		trails: MarkdownDataWithoutContent<TrailMetadata>[];
	}

	let {trails}: Props = $props();
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
	<h2>Trails</h2>

	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eleifend risus odio. Sed
		nisl metus, accumsan a augue at, convallis aliquam lectus. Nulla facilisi. Aliquam cursus
		vulputate fermentum. Proin congue id nisi sed condimentum. Vestibulum porttitor nisi leo. Donec
		justo justo, fringilla a tristique vel, dapibus et est.
	</p>

	<div class="map">
		<Map />
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
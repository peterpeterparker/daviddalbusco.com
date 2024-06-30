<script lang="ts">
	import Projects from '$lib/components/projects.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	export let projects: MarkdownData<PortfolioMetadata>[];
</script>

<Projects {projects}>
	<h2>Personal Projects</h2>

	<p>
		As an open-source enthusiast, I have actively developed various projects for both fun and
		learning. Here are some of my notable creations:
	</p>
</Projects>

<style lang="scss">
	p {
		margin: 0 0 3.25em;
	}
</style>

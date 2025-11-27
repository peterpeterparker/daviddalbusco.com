<script lang="ts">
	import Projects from '$lib/components/Projects.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	interface Props {
		projects: MarkdownData<PortfolioMetadata>[];
	}

	let { projects }: Props = $props();
</script>

<Projects {projects}>
	<h2 id="projects">Personal Projects</h2>

	<p>As an open-source enthusiast, I've built a number of projects. Here are some highlights:</p>
</Projects>

<style lang="scss">
	p {
		margin: 0 0 3.25em;

		@media screen and (max-width: 960px) {
			display: none;
		}
	}
</style>

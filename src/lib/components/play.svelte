<script lang="ts">
	import Projects from '$lib/components/projects.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	interface Props {
		projects: MarkdownData<PortfolioMetadata>[];
	}

	let { projects }: Props = $props();
</script>

<Projects {projects}>
	<h2>Personal Projects</h2>

	<p>
		As an open-source enthusiast, I've developed various personal projects. Here are some of my
		notable creations:
	</p>
</Projects>

<style lang="scss">
	p {
		margin: 0 0 3.25em;

		@media screen and (max-width: 960px) {
			display: none;
		}
	}
</style>

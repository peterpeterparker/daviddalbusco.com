<script lang="ts">
	import Projects from '$lib/components/Projects.svelte';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import type { MarkdownData } from '$lib/types/markdown';

	interface Props {
		projects: MarkdownData<PortfolioMetadata>[];
	}

	let { projects }: Props = $props();
</script>

<Projects {projects}>
	<h2 id="portfolio">Portfolio</h2>

	<p>
		I've had the pleasure of collaborating with a diverse range of clients. From small startups and
		corporates to universities and foundations.
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

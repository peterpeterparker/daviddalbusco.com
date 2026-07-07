<script lang="ts">
	import Projects from '$lib/portfolio/components/Projects.svelte';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
	import type { PageData } from '$lib/core/types/page';

	interface Props {
		projects: PageData<PortfolioMetadata>[];
	}

	let { projects }: Props = $props();
</script>

<Projects {projects}>
	<h2 id="portfolio">Portfolio</h2>

	<p>
		I've collaborated with a diverse range of clients - startups, corporates, universities, and
		foundations.
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

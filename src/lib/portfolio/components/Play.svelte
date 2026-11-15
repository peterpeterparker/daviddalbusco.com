<script lang="ts">
	import SideProjects from '#lib/portfolio/components/SideProjects.svelte';
	import type { PageData } from '#lib/core/types/page.js';
	import type { PortfolioMetadata } from '#lib/portfolio/types/portfolio.js';

	interface Props {
		projects: PageData<PortfolioMetadata>[];
	}

	let { projects }: Props = $props();
</script>

<SideProjects {projects}>
	<h2 id="projects">Side Projects</h2>

	<p>
		I also build and ship my own software, from products that run real businesses to tools that
		started as itches I needed to scratch.
	</p>
</SideProjects>

<style lang="scss">
	p {
		margin: 0 0 1.25em;

		@media screen and (max-width: 960px) {
			display: none;
		}
	}
</style>

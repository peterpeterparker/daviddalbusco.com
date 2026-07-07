<script lang="ts">
	import SideProjects from '$lib/portfolio/components/SideProjects.svelte';
	import type { PageData } from '$lib/core/types/page';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';

	interface Props {
		projects: PageData<PortfolioMetadata>[];
	}

	let { projects }: Props = $props();
</script>

<SideProjects {projects}>
	<h2 id="projects">Side Projects</h2>

	<p>
		I build things on the side. Some grew into real products, some are just tools I made for myself,
		some were pure learning experiments.
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

<script lang="ts">
	import SideProject from '$lib/portfolio/components/SideProject.svelte';
	import Section from '$lib/core/components/Section.svelte';
	import type { PageData } from '$lib/core/types/page';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
	import type { Snippet } from 'svelte';

	interface Props {
		projects: PageData<PortfolioMetadata>[];
		children?: Snippet;
	}

	let { projects, children }: Props = $props();
</script>

<Section>
	{@render children?.()}

	<ul>
		{#each projects as project (project.slug)}
			<SideProject {project} />
		{/each}
	</ul>
</Section>

<script lang="ts">
	import SideProject from '$lib/components/SideProject.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	interface Props {
		projects: MarkdownData<PortfolioMetadata>[];
		children?: import('svelte').Snippet;
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

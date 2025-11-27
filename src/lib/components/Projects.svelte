<script lang="ts">
	import '../../theme/_grid.scss';

	import Project from '$lib/components/Project.svelte';
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

	<div class="grid">
		{#each projects as project (project.slug)}
			<Project {project} />
		{/each}
	</div>
</Section>

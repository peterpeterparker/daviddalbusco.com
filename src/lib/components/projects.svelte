<script lang="ts">
	import '../../theme/_grid.scss';

	import Project from '$lib/components/project.svelte';
	import Section from '$lib/components/section.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	export let projects: MarkdownData<PortfolioMetadata>[];
</script>

<Section>
	<slot />

	<div class="grid">
		{#each projects as project}
			<Project {project} />
		{/each}
	</div>
</Section>

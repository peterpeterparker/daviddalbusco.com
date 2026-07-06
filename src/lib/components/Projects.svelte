<script lang="ts">
	import Project from '$lib/components/Project.svelte';
	import Section from '$lib/components/Section.svelte';
	import type { PageData } from '$lib/types/page';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	interface Props {
		projects: PageData<PortfolioMetadata>[];
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

<style lang="scss">
	@use '../../theme/_grid.scss';

	.grid {
		@include grid.panel;
	}
</style>

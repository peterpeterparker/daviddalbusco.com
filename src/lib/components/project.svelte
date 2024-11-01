<!-- @migration-task Error while migrating Svelte code: Encountered an export declaration pattern that is not supported for automigration. -->
<script lang="ts">
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import Card from '$lib/components/card.svelte';

	interface Props {
		project: MarkdownData<PortfolioMetadata>;
	}

	let { project }: Props = $props();

	let metadata = $derived(project.metadata);
	let slug = $derived(project.slug);

	let background = $derived(metadata.background);
	let title = $derived(metadata.title);
	let description = $derived(metadata.description);
	let icon = $derived(metadata.icon);
</script>

<Card {background} image={icon} path="portfolio" {slug}>
	<h3>{title}</h3>
	<p>{description}</p>
</Card>

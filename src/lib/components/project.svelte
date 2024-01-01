<script lang="ts">
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	import Card from '$lib/components/card.svelte';

	export let project: MarkdownData<PortfolioMetadata>;

	export let { metadata, slug } = project;
	export let { background, title, description, icon } = metadata;
</script>

<Card {background} image={icon} path="portfolio" {slug}>
	<h3>{title}</h3>
	<p>{description}</p>
</Card>

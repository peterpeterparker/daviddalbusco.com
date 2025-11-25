<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/seo.svelte';
	import Button from '$lib/components/button.svelte';
	import { goto } from '$app/navigation';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import Section from '$lib/components/section.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let portfolio: MarkdownData<PortfolioMetadata> = $derived(data.portfolio);

	let content: string = $derived(portfolio.content);

	const navigatePortfolio = () => goto('/portfolio');
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../../theme/_page.scss';

		@include page.light;
	</style>
</svelte:head>

<Section>
	{@html content}

	<div class="action"><Button action={navigatePortfolio}>Continue to portfolio</Button></div>
</Section>

<style lang="scss">
	.action {
		margin: 3.45em 0 0;
	}
</style>

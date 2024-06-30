<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/seo.svelte';
	import Button from '$lib/components/button.svelte';
	import { goto } from '$app/navigation';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import Section from '$lib/components/section.svelte';

	export let data: PageData;

	let portfolio: MarkdownData<PortfolioMetadata>;
	$: ({ portfolio } = data);

	let content: string;
	$: ({ content } = portfolio);

	const navigatePortfolio = () => goto('/portfolio');
</script>

<svelte:head>
	<Seo />

	<style>
		body > div:first-child {
			--menu-color: black;
			--section-color: black;
		}
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

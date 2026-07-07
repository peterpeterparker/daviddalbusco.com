<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
	import Button from '$lib/core/components/Button.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from '$lib/core/types/page';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
	import Section from '$lib/core/components/Section.svelte';
	import '../../../theme/_code.scss';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();

	let portfolio = $derived<PageData<PortfolioMetadata>>(data.portfolio);

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

<Breadcrumb
	route={{ title: 'Portfolio', path: '/portfolio' }}
	page={{ title: portfolio.metadata.title }}
/>

<Section>
	{@html content}

	<div class="action"><Button action={navigatePortfolio}>Continue to portfolio</Button></div>
</Section>

<style lang="scss">
	.action {
		margin: 3.45em 0 0;
	}
</style>

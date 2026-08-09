<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
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

	let slug = $derived(portfolio.slug.name);

	let content = $derived(portfolio.content);
	let metadata = $derived(portfolio.metadata);

	let noRobots = $derived(metadata.robots === 'disallow');
	let { title, description } = $derived(metadata);
</script>

<svelte:head>
	<Seo {title} {description} {noRobots} url={`/portfolio/${slug}`} />

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
</Section>

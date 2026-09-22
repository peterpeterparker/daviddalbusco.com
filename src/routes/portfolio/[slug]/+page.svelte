<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
	import type { PageData } from '$lib/core/types/page';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
	import Section from '$lib/core/components/Section.svelte';
	import '../../../theme/_code.scss';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';
	import { SITE_URL } from '$lib/core/constants';
	import { portfolioToLinkedData } from '$lib/portfolio/linked-data';

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

	let canonical = $derived(`${SITE_URL}/portfolio/${slug}`);

	let linkedData = $derived(portfolioToLinkedData({ ...metadata, canonical }));
</script>

<svelte:head>
	<Seo {title} {description} {noRobots} url={canonical} {linkedData} />

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

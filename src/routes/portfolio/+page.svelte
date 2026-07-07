<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
	import Work from '$lib/portfolio/components/Work.svelte';
	import Play from '$lib/portfolio/components/Play.svelte';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
	import type { PageData } from '$lib/core/types/page';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();
	let work: PageData<PortfolioMetadata>[] = $derived(data.work);
	let play: PageData<PortfolioMetadata>[] = $derived(data.play);
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Breadcrumb route={{ title: 'Portfolio', path: '/portfolio' }} />

<Work projects={work} />

<Play projects={play} />

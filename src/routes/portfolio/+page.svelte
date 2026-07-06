<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import Work from '$lib/components/Work.svelte';
	import Play from '$lib/components/Play.svelte';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import type { PageData } from '$lib/types/page';

	interface Props {
		data: PageData;
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

<Work projects={work} />

<Play projects={play} />

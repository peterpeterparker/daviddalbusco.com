<script lang="ts">
	import '../../theme/_grid.scss';

	import type { PageData } from './$types';
	import Seo from '$lib/components/seo.svelte';
	import Work from '$lib/components/work.svelte';
	import Play from '$lib/components/play.svelte';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import type { MarkdownData } from '$lib/types/markdown';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let work: MarkdownData<PortfolioMetadata>[] = $derived(data.work);
	let play: MarkdownData<PortfolioMetadata>[] = $derived(data.play);
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

<Work projects={work} />

<Play projects={play} />

<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Trails from '$lib/components/Trails.svelte';
	import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
	import type { PageData } from './$types';
	import type { TrailMetadata } from '$lib/types/trail';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let trails = $derived<MarkdownDataWithoutContent<TrailMetadata>[]>(data.trails);
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Trails {trails} />

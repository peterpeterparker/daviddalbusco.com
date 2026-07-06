<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Trails from '$lib/trails/components/Trails.svelte';
	import type { PageDataWithoutContent } from '$lib/types/page';
	import type { PageData as ServerPageData } from './$types';
	import type { Trail } from '$lib/trails/types/trail';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();
	let trails = $derived<PageDataWithoutContent<Trail>[]>(data.trails);
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Trails {trails} />

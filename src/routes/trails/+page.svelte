<script lang="ts">
	import Seo from '$lib/core/components/Seo.svelte';
	import Trails from '$lib/trails/components/Trails.svelte';
	import type { PageDataWithoutContent } from '$lib/core/types/page';
	import type { PageData as ServerPageData } from './$types';
	import type { Trail } from '$lib/trails/types/trail';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';

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

<Breadcrumb route={{ title: 'Trails', path: '/trails' }} />

<Trails {trails} />

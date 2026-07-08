<script lang="ts">
	import Seo from '$lib/core/components/Seo.svelte';
	import Trails from '$lib/trails/components/Trails.svelte';
	import type { PageDataWithoutContent } from '$lib/core/types/page';
	import type { PageData as ServerPageData } from './$types';
	import type { Trail } from '$lib/trails/types/trail';
	import Breadcrumb from '$lib/core/components/Breadcrumb.svelte';
	import NoTrails from '$lib/trails/components/NoTrails.svelte';
	import { capitalize } from '$lib/core/utils/text.utils';
	import { page } from '$app/state';
	import { notEmptyString } from '$lib/core/utils/nullish.utils';
	import { TRAILS_DESCRIPTION, TRAILS_SOCIAL_IMAGE, TRAILS_TITLE } from '$lib/trails/constants';
	import { SITE_URL } from '$lib/core/constants';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();
	let trails = $derived<PageDataWithoutContent<Trail>[]>(data.trails);
</script>

<svelte:head>
	<Seo
		image={TRAILS_SOCIAL_IMAGE}
		title={TRAILS_TITLE}
		description={TRAILS_DESCRIPTION}
		url={`${SITE_URL}/trails${notEmptyString(page.params.year) ? `/${page.params.year}` : ''}`}
	/>

	<style lang="scss">
		@use '../../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Breadcrumb
	route={{ title: 'Trails', path: '/trails' }}
	group={notEmptyString(page.params.year)
		? { title: capitalize(page.params.year), path: page.params.year }
		: undefined}
/>

{#if trails.length > 0}
	<Trails {trails} />
{:else}
	<NoTrails />
{/if}

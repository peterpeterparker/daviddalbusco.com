<script lang="ts">
	import type { PageDataWithoutContent } from '$lib/types/page';
	import Card from '$lib/components/Card.svelte';
	import { env } from '$env/dynamic/public';
	import type { Trail } from '$lib/types/trail';
	import { formatDate } from '$lib/utils/date.utils';
	import Sport from '$lib/components/Sport.svelte';

	interface Props {
		trail: PageDataWithoutContent<Trail>;
	}

	let { trail }: Props = $props();

	let metadata = $derived(trail.metadata);
	let slug = $derived(trail.slug);

	let title = $derived(metadata.metadata.title);
	let image = $derived(
		metadata.metadata.photos[0].replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS)
	);
	let trailDate = $derived(metadata.metadata.date);
	let sport = $derived(metadata.metadata.sport);
</script>

<Card background="transparent" cover={true} {image} path="trails" {slug}>
	<h3>{title}</h3>

	<p class="sport"><Sport {sport} /></p>
	<p class="date">{formatDate(trailDate)}</p>
</Card>

<style lang="scss">
	h3 {
		font-size: 1rem;
		margin: 0 0 0.45rem;
	}

	.date,
	.sport {
		font-size: 0.8rem;
		margin: 0;
	}
</style>

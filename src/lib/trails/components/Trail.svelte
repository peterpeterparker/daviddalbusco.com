<script lang="ts">
	import type { PageDataWithoutContent } from '$lib/core/types/page';
	import Card from '$lib/core/components/Card.svelte';
	import type { Trail } from '$lib/trails/types/trail';
	import { formatDate } from '$lib/core/utils/date.utils';
	import Sport from '$lib/trails/components/Sport.svelte';
	import { assetUrl } from '$lib/core/utils/assets.utils';

	interface Props {
		trail: PageDataWithoutContent<Trail>;
	}

	let { trail }: Props = $props();

	let metadata = $derived(trail.metadata);
	let slug = $derived(trail.slug);

	let title = $derived(metadata.metadata.title);
	let image = $derived(assetUrl(metadata.metadata.photos[0]));
	let trailDate = $derived(metadata.metadata.date);
	let sport = $derived(metadata.metadata.sport);
</script>

<Card background="transparent" cover={true} {image} path="trails" {slug}>
	<h3>{title}</h3>

	<p class="date">{formatDate(trailDate)}</p>
	<p class="sport"><Sport {sport} /></p>
</Card>

<style lang="scss">
	h3 {
		font-size: 1rem;
		margin: 0;
	}

	.date,
	.sport {
		font-size: 0.8rem;
		margin: 0;
	}
</style>

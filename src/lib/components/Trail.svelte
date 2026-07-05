<script lang="ts">
	import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
	import Card from '$lib/components/Card.svelte';
	import { env } from '$env/dynamic/public';
	import type { TrailMetadata } from '$lib/types/trail';
	import { formatDate } from '$lib/utils/date.utils';

	interface Props {
		trail: MarkdownDataWithoutContent<TrailMetadata>;
	}

	let { trail }: Props = $props();

	let metadata = $derived(trail.metadata);
	let slug = $derived(trail.slug);

	let title = $derived(metadata.title);
	let image = $derived(
		metadata.photos[0].replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS)
	);
	let trailDate = $derived(metadata.date);
</script>

<Card background="transparent" cover={true} {image} path="blog" {slug}>
	<p>{title}</p>

	<p class="date">{formatDate(trailDate)}</p>
</Card>

<style lang="scss">
	.date {
		font-size: 0.8rem;
		margin: 0;
	}
</style>

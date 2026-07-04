<script lang="ts">
	import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
	import Card from '$lib/components/Card.svelte';
	import { env } from '$env/dynamic/public';
	import type {TrailMetadata} from "$lib/types/trail";

	interface Props {
		trail: MarkdownDataWithoutContent<TrailMetadata>;
	}

	let { trail }: Props = $props();

	let metadata = $derived(trail.metadata);
	let slug = $derived(trail.slug);

	let title = $derived(metadata.title);
	let image = $derived(
		metadata.image.replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS)
	);
	let postDate = $derived(metadata.date);
</script>

<Card background="transparent" cover={true} {image} path="blog" {slug}>
	<p>{title}</p>

	<p class="date">
		{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
			new Date(postDate)
		)}
	</p>
</Card>

<style lang="scss">
	.date {
		font-size: 0.8rem;
		margin: 0;
	}
</style>

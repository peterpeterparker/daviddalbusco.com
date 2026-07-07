<script lang="ts">
	import type { PageDataWithoutContent } from '$lib/core/types/page';
	import type { BlogMetadata } from '$lib/blog/types/blog';
	import Card from '$lib/core/components/Card.svelte';
	import { formatDate } from '$lib/core/utils/date.utils';
	import { assetUrl } from '$lib/core/utils/assets.utils';

	interface Props {
		post: PageDataWithoutContent<BlogMetadata>;
	}

	let { post }: Props = $props();

	let metadata = $derived(post.metadata);
	let slug = $derived(post.slug);

	let title = $derived(metadata.title);
	let description = $derived(metadata.description);
	let image = $derived(assetUrl(metadata.image));
	let postDate = $derived(metadata.date);
</script>

<Card background="transparent" cover={true} {image} path="blog" {slug}>
	<h3>{title}</h3>
	<p>{description}</p>

	<p class="date">{formatDate(postDate)}</p>
</Card>

<style lang="scss">
	.date {
		font-size: 0.8rem;
		margin: 0;
	}
</style>

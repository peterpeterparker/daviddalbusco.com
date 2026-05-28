<!-- @migration-task Error while migrating Svelte code: Encountered an export declaration pattern that is not supported for automigration. -->
<script lang="ts">
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';
	import Card from '$lib/components/Card.svelte';
	import {base} from "$app/paths";
	import IconSkull from "$lib/icons/IconSkull.svelte";

	interface Props {
		project: MarkdownData<PortfolioMetadata>;
	}

	let { project }: Props = $props();

	let metadata = $derived(project.metadata);
	let slug = $derived(project.slug);

	let background = $derived(metadata.background);
	let title = $derived(metadata.title);
	let description = $derived(metadata.description);
	let icon = $derived(metadata.icon);

	let status = $derived(metadata.status);
	let dead = $derived(status === "archived" || status === "maintenance");
</script>

<li>
	<a href={`${base}/portfolio/${slug}`}>
		<span>{title}</span> {#if dead}<IconSkull />{/if}
	</a>
</li>

<style lang="scss">
	a {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>
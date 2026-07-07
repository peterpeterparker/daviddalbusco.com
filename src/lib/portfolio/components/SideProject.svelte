<!-- @migration-task Error while migrating Svelte code: Encountered an export declaration pattern that is not supported for automigration. -->
<script lang="ts">
	import type { PageData } from '$lib/core/types/page';
	import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
	import { base } from '$app/paths';
	import IconSkull from '$lib/core/icons/IconSkull.svelte';
	import IconFlask from '$lib/core/icons/IconFlask.svelte';

	interface Props {
		project: PageData<PortfolioMetadata>;
	}

	let { project }: Props = $props();

	let metadata = $derived(project.metadata);
	let slug = $derived(project.slug);

	let title = $derived(metadata.title);

	let status = $derived(metadata.status);
	let dead = $derived(status === 'archived' || status === 'maintenance');
	let experiment = $derived(status === 'experiment');
</script>

<li>
	<a href={`${base}/portfolio/${slug}`}>
		<span>{title}</span>
		{#if dead}
			<IconSkull />
		{:else if experiment}
			<IconFlask />
		{/if}
	</a>
</li>

<style lang="scss">
	a {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>

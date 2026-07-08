<script lang="ts">
	import type { Sport } from '$lib/trails/types/trail';

	interface Props {
		sport: Sport;
	}

	let { sport }: Props = $props();
</script>

<mark class={sport}>
	{#if sport === 'trail-running'}
		Trail Running
	{:else if sport === 'gravel'}
		Gravel Bike
	{:else}
		Road Bike
	{/if}
</mark>

<style lang="scss">
	.cycling {
		background: #009fb7;
		color: #ffffff;
	}

	.gravel {
		background: #5f00ba;
		color: #ffffff;
	}
</style>

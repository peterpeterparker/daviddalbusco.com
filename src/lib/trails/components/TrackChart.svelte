<script lang="ts">
	import { AreaChart, Tooltip, type ChartState } from 'layerchart';
	import type { MapGpxPoint, MapGpxPointId, MapGpxPoints } from '$lib/trails/types/map';
	import { formatDistance, formatElevation } from '$lib/trails/utils/track.utils';

	interface Props {
		gpxPoints: MapGpxPoints;
		gpxPointId: MapGpxPointId | undefined;
	}

	// eslint-disable-next-line no-useless-assignment
	let { gpxPoints, gpxPointId = $bindable(undefined) }: Props = $props();

	let context = $state<ChartState>();

	$effect(() => {
		gpxPointId = context?.tooltip.data?.id;
	});
</script>

<article>
	<AreaChart
		bind:context
		data={gpxPoints}
		x="distance"
		y="ele"
		height={200}
		props={{
			xAxis: { format: (v: number) => `${v}km` },
			yAxis: { format: (v: number) => `${v}m` }
		}}
	>
		{#snippet tooltip()}
			<Tooltip.Root>
				{#snippet children({ data }: { data: MapGpxPoint })}
					<Tooltip.Item label="Elevation" value={formatElevation(data.ele)} />
					<Tooltip.Item label="Distance" value={formatDistance(data.distance)} />
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</AreaChart>
</article>

<style lang="scss">
	article {
		min-height: 275px;
		--color-primary: var(--color-highlight);
		padding: 2.25rem 1.25rem 0;
		border: 0.25rem solid black;
	}

	article :global(svg) {
		overflow: visible;
	}

	article :global(line) {
		stroke: var(--color-light);
	}
</style>

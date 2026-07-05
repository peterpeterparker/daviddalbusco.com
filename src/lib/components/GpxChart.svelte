<script lang="ts">
	import { AreaChart, defaultChartPadding, Tooltip, type ChartState } from 'layerchart';
	import type { MapGpxPoint, MapGpxPointId, MapGpxPoints } from '$lib/types/map';

	interface Props {
		gpxPoints: MapGpxPoints;
		gpxPointId: MapGpxPointId | undefined;
	}

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
		padding={defaultChartPadding({ right: 10 })}
		height={200}
		props={{
			xAxis: { format: (v: number) => `${v}km` },
			yAxis: { format: (v: number) => `${v}m` }
		}}
	>
		{#snippet tooltip()}
			<Tooltip.Root>
				{#snippet children({ data }: { data: MapGpxPoint })}
					<Tooltip.Item label="Elevation" value={`${Math.round(data.ele)}m`} />
					<Tooltip.Item label="Distance" value={`${data.distance.toFixed(2)}km`} />
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</AreaChart>
</article>

<style lang="scss">
	article {
		min-height: 225px;
		--color-primary: var(--color-highlight);
	}
</style>

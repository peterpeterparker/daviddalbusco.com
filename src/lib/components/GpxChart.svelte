<script lang="ts">
    import { AreaChart, defaultChartPadding, Tooltip } from 'layerchart';
    import type {MapGpxPoints} from "$lib/types/map";

    interface Props {
        gpxPoints: MapGpxPoints;
    }

    let {gpxPoints}: Props = $props();

    interface ChartData {x: number, y: number}

    let data = $derived<ChartData[]>(gpxPoints.map(({distance, ele}) => ({x: distance, y: ele})))
</script>

<article>
    <AreaChart {data} x="x" y="y" padding={defaultChartPadding({ right: 10 })} height={200} props={{

		xAxis: { format: (v: number) => `${v}km` },
		yAxis: { format: (v: number) => `${v}m` }
	}} >
        {#snippet tooltip()}
            <Tooltip.Root>
                {#snippet children({ data }: { data: ChartData })}
                    <Tooltip.Item label="Distance" value={`${data.x.toFixed(2)}km`} />
                    <Tooltip.Item label="Elevation" value={`${Math.round(data.y)}m`} />
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
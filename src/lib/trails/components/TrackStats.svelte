<script lang="ts">
	import type { TrailTrack } from '$lib/trails/types/trail';
	import { formatDistance, formatElevation } from '$lib/trails/utils/track.utils';
	import { secondsToDuration } from '$lib/core/utils/date.utils';

	interface Props {
		track: TrailTrack;
	}

	let { track }: Props = $props();

	let distance = $derived(track.distance);
	let elevation = $derived(track.elevation);
	let duration = $derived(track.duration);
</script>

<article>
	<h3>Trail statistics</h3>

	<dl>
		<dt>Distance</dt>
		<dd>{formatDistance(distance)}</dd>

		<dt>Elevation gain</dt>
		<dd>{formatElevation(elevation.gain)}</dd>

		<dt>Elevation loss</dt>
		<dd>{formatElevation(elevation.loss)}</dd>

		<dt>Max elevation</dt>
		<dd>{formatElevation(elevation.max)}</dd>

		<dt>Time</dt>
		<dd>{secondsToDuration({ seconds: BigInt(duration) })}</dd>
	</dl>
</article>

<style lang="scss">
	article {
		border: 0.25rem solid black;
		padding: 1rem 1.25rem;
	}

	dd {
		margin: 0 0 0.75rem;
	}
</style>

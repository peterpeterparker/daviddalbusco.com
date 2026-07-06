<script lang="ts">
	import type { TrailTrack } from '$lib/types/trail';
    import {formatDistance, formatElevation} from "$lib/utils/track.utils";

	interface Props {
		track: TrailTrack;
	}

	let { track }: Props = $props();

	let distance = $derived(track.distance);
	let elevation = $derived(track.elevation);
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
	</dl>
</article>

<style lang="scss">
	article {
		border: 0.25rem solid black;
		padding: 1rem;
	}

    dd {
      margin: 0 0 0.75rem;
    }
</style>

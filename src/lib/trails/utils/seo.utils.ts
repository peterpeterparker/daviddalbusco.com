import { secondsToDuration } from '$lib/core/utils/date.utils';
import type { Trail } from '$lib/trails/types/trail';
import { formatDistance, formatElevation } from '$lib/trails/utils/track.utils';

export const generateTrailDescription = ({
	trail: { metadata, track }
}: {
	trail: Trail;
}): string => {
	const { title, sport } = metadata;
	const {
		distance,
		elevation: { gain },
		duration
	} = track;

	const sportLabel =
		sport === 'trail-running' ? 'Trail run' : sport === 'cycling' ? 'Road cycling' : 'Gravel ride';

	return `${sportLabel}: ${title}. ${formatDistance(distance)}, ${formatElevation(gain)} elevation gain, ${secondsToDuration({ seconds: BigInt(duration) })}.`;
};

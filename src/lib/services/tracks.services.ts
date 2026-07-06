import type { MapGpxPoint, MapGpxPoints } from '$lib/types/map';
import type { TrailMetadata } from '$lib/types/trail';
import { assetUrl } from '$lib/utils/assets.utils';
import { calculateDistance } from '$lib/utils/distance.utils';
import { safeExec, type Result } from '$lib/utils/fn.utils';

export const loadTrack = async (
	data: Pick<TrailMetadata, 'gpx'>
): Promise<Result<MapGpxPoints>> => {
	return await safeExec(async () => {
		return await load(data);
	});
};

const load = async ({ gpx }: Pick<TrailMetadata, 'gpx'>): Promise<MapGpxPoints> => {
	const response = await fetch(assetUrl(gpx));

	if (!response.ok) {
		throw new Error('Cannot fetch GPX data.');
	}

	const text = await response.text();

	const parser = new DOMParser();
	const doc = parser.parseFromString(text, 'text/xml');

	const nodes = doc.querySelectorAll('trkpt');

	const rawPoints: Partial<MapGpxPoint>[] = [...nodes.values()].map((node) => {
		const lat = node.getAttribute('lat');
		const lon = node.getAttribute('lon');
		const ele = node.querySelector('ele')?.textContent ?? null;

		return {
			lat: lat !== null && lat.trim() !== '' ? parseFloat(lat) : undefined,
			lon: lon !== null && lon.trim() !== '' ? parseFloat(lon) : undefined,
			ele: ele !== null && ele.trim() !== '' ? parseFloat(ele) : undefined
		};
	});

	const points = rawPoints.filter(
		({ lat, lon, ele }) => lat !== undefined && lon !== undefined && ele !== undefined
	) as Omit<MapGpxPoint, 'distance'>[];

	const extendGpxPoints = (points: Omit<MapGpxPoint, 'distance'>[]): MapGpxPoints => {
		let total = 0;

		return points.map((point, i) => {
			if (i > 0) {
				total += calculateDistance({
					startWaypoint: points[i - 1],
					endWaypoint: point
				});
			}
			return { ...point, id: window.crypto.randomUUID(), distance: total };
		});
	};

	return extendGpxPoints(points);
};

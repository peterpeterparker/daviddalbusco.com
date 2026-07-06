import type { MapGpxPoint } from '$lib/types/map';
import type { TrailElevation, TrailMetadata, TrailTrack } from '$lib/types/trail';
import { calculateDistance } from '$lib/utils/distance.utils';
import { XMLParser } from 'fast-xml-parser';
import { readFile } from 'node:fs/promises';

type ServerMapGpxPoints = Omit<MapGpxPoint, 'distance' | 'id'>[];

export const getTrack = async ({ gpx }: Pick<TrailMetadata, 'gpx'>): Promise<TrailTrack> => {
	const xmlStr = await readFile(
		gpx.replaceAll('https://daviddalbusco.com/assets', './assets'),
		'utf-8'
	);

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: ''
	});

	type GpxTrackPoint = {
		lat: string;
		lon: string;
		ele: number;
		time: string; // e.g. 2026-07-03T08:57:23Z
	};

	type Gpx = {
		gpx: {
			trk: {
				trkseg: {
					trkpt: GpxTrackPoint[];
				};
			};
		};
	};

	const {
		gpx: {
			trk: {
				trkseg: { trkpt }
			}
		}
	}: Gpx = parser.parse(xmlStr);

	const mapGpxPoints = (): ServerMapGpxPoints =>
		trkpt.map(({ lat, lon, ele }) => ({
			lat: parseFloat(lat),
			lon: parseFloat(lon),
			ele
		}));

	const points = mapGpxPoints();

	// Optimistic. I could likely ignore gpx coordinates undefined but, I trust the data I provide.
	const { lat, lon } = points[0];

	return {
		location: { lat, lon },
		distance: sumDistance({ points }),
		elevation: computeElevation({ points })
	};
};

const sumDistance = ({ points }: { points: ServerMapGpxPoints }): number => {
	let total = 0;

	points.forEach((point, i) => {
		if (i > 0) {
			total += calculateDistance({
				startWaypoint: points[i - 1],
				endWaypoint: point
			});
		}
	});

	return total;
};

const computeElevation = ({
	points,
	threshold = 2
}: {
	points: ServerMapGpxPoints;
	threshold?: number;
}): TrailElevation => {
	let gain = 0;
	let loss = 0;

	for (let i = 1; i < points.length; i++) {
		const delta = points[i].ele - points[i - 1].ele;

		if (delta > threshold) {
			gain += delta;
		} else if (delta < -threshold) {
			loss += Math.abs(delta);
		}
	}

	return {
		gain,
		loss
	};
};

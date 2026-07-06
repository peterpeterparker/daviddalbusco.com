import type { PageData } from '$lib/types/page';
import type { Trail, TrailMetadata, TrailTrack } from '$lib/types/trail';
import { get, list } from '$plugins/markdown.plugin';
import { XMLParser } from 'fast-xml-parser';
import { readFile } from 'node:fs/promises';

export const listTrails = async (): Promise<PageData<Trail>[]> => {
	const trails = await list<TrailMetadata>({ path: 'trails' });

	const populate = async ({
		metadata,
		...rest
	}: PageData<TrailMetadata>): Promise<PageData<Trail>> => {
		const { location } = await getStartLocation(metadata);

		return {
			...rest,
			metadata: {
				metadata,
				track: {
					location
				}
			}
		};
	};

	const results = await Promise.all(trails.map(populate));

	return results.sort(
		(
			{
				metadata: {
					metadata: { date: dateA }
				}
			},
			{
				metadata: {
					metadata: { date: dateB }
				}
			}
		) => {
			const timeA = new Date(dateA).getTime();
			const timeB = new Date(dateB).getTime();

			return timeB - timeA;
		}
	);
};

export const getTrail = ({ slug }: Record<string, string>): Promise<PageData<TrailMetadata>> =>
	get<TrailMetadata>({ slug, path: 'trails' });

const getStartLocation = async ({
	gpx
}: Pick<TrailMetadata, 'gpx'>): Promise<Pick<TrailTrack, 'location'>> => {
	const xmlStr = await readFile(
		gpx.replaceAll('https://daviddalbusco.com/assets', './assets'),
		'utf-8'
	);

	type GpxTrackPoint = {
		lat: string;
		lon: string;
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

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: ''
	});
	const {
		gpx: {
			trk: {
				trkseg: { trkpt }
			}
		}
	}: Gpx = parser.parse(xmlStr);

	// Optimistic. I could likely ignore gpx coordinates undefined but, I trust the data I provide.
	const { lat, lon } = trkpt[0];

	return {
		location: { lat: parseFloat(lat), lon: parseFloat(lon) }
	};
};

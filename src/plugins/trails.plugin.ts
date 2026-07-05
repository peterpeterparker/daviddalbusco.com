import type { MarkdownData } from '$lib/types/markdown';
import type { TrailMetadata, TrailMetadataWithoutStartLocation } from '$lib/types/trail';
import { get, list } from '$plugins/markdown.plugin';
import { XMLParser } from 'fast-xml-parser';
import { readFile } from 'node:fs/promises';

export const listTrails = async (): Promise<MarkdownData<TrailMetadata>[]> => {
	const trails = await list<TrailMetadataWithoutStartLocation>({ path: 'trails' });

	const populate = async ({
		metadata,
		...rest
	}: MarkdownData<TrailMetadataWithoutStartLocation>): Promise<MarkdownData<TrailMetadata>> => {
		const { location } = await getStartLocation(metadata);

		return {
			...rest,
			metadata: {
				...metadata,
				location
			}
		};
	};

	const results = await Promise.all(trails.map(populate));

	return results.sort(({ metadata: { date: dateA } }, { metadata: { date: dateB } }) => {
		const timeA = new Date(dateA).getTime();
		const timeB = new Date(dateB).getTime();

		return timeB - timeA;
	});
};

export const getTrail = ({ slug }: Record<string, string>): Promise<MarkdownData<TrailMetadata>> =>
	get<TrailMetadata>({ slug, path: 'trails' });

const getStartLocation = async ({
	gpx
}: Pick<TrailMetadataWithoutStartLocation, 'gpx'>): Promise<Pick<TrailMetadata, 'location'>> => {
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

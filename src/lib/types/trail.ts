import type { DateString } from '$lib/types/date';
import type { MapAnnotation } from '$lib/types/map';

export type Sport = 'trail' | 'bike' | 'gravel';

export type TrailStartLocation = Omit<MapAnnotation, 'title'>;

export interface TrailMetadata {
	title: string;
	date: DateString;
	photos: [string, ...string[]];
	gpx: string;
	location: TrailStartLocation;
	sport: Sport;
}

export type TrailMetadataWithoutStartLocation = Omit<TrailMetadata, 'location'>;

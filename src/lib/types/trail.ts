import type { DateString } from '$lib/types/date';
import type { MapLocation } from '$lib/types/map';

export type Sport = 'trail-running' | 'cycling' | 'gravel';

export type TrailStartLocation = MapLocation;

export interface TrailMetadata {
	title: string;
	date: DateString;
	photos: [string, ...string[]];
	gpx: string;
	sport: Sport;
}

export interface TrailTrack {
	location: TrailStartLocation;
}

export interface Trail {
	metadata: TrailMetadata;
	track: TrailTrack;
}

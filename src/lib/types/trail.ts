import type { DateString } from '$lib/types/date';
import type { MapLocation } from '$lib/types/map';

export type Sport = 'trail-running' | 'cycling' | 'gravel';

type TrailStartLocation = MapLocation;
export interface TrailElevation {
	gain: number;
	loss: number;
}

export interface TrailMetadata {
	title: string;
	date: DateString;
	photos: [string, ...string[]];
	gpx: string;
	sport: Sport;
}

export interface TrailTrack {
	location: TrailStartLocation;
	distance: number;
	elevation: TrailElevation;
}

export interface Trail {
	metadata: TrailMetadata;
	track: TrailTrack;
}

import type { DateString } from '$lib/core/types/date';
import type { MapLocation } from '$lib/trails/types/map';

export type Sport = 'trail-running' | 'cycling' | 'gravel';

type Meters = number;
type Kilometers = number;
type Seconds = number;

type TrailStartLocation = MapLocation;

export interface TrailElevation {
	gain: Meters;
	loss: Meters;
	max: Meters;
	min: Meters;
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
	distance: Kilometers;
	elevation: TrailElevation;
	duration: Seconds;
}

export interface Trail {
	metadata: TrailMetadata;
	track: TrailTrack;
}

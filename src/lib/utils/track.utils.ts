import type { TrailTrack } from '$lib/types/trail';

export const formatDistance = (distance: TrailTrack['distance']): string =>
	`${distance.toFixed(2)}km`;

export const formatElevation = (elevation: number): string => `${Math.round(elevation)}m`;


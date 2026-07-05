import type { MapLocation } from '$lib/types/map';

const toRad = (value: number): number => (value * Math.PI) / 180;

const EARTH_RADIUS_IN_KM = 6371;

// https://medium.com/trabe/processing-gpx-tracks-using-javascript-c2b0afa71e55
export const calculateDistance = ({
	endWaypoint,
	startWaypoint
}: {
	endWaypoint: MapLocation;
	startWaypoint: MapLocation;
}): number => {
	const dLat = toRad(endWaypoint.lat - startWaypoint.lat);
	const dLon = toRad(endWaypoint.lon - startWaypoint.lon);

	const startLat = toRad(startWaypoint.lat);
	const endLat = toRad(endWaypoint.lat);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(startLat) * Math.cos(endLat);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return EARTH_RADIUS_IN_KM * c;
};

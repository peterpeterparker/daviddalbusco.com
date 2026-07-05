export interface MapLocation {
	lat: number;
	lon: number;
}

export type MapGpxPoint = MapLocation & { ele: number, distance: number };

export type MapGpxPoints = MapGpxPoint[];

export type MapAnnotation = {
	location: MapLocation;
	title: string;
} & Pick<URL, 'pathname'>;

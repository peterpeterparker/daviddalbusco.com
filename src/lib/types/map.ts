export interface MapLocation {
	lat: number;
	lon: number;
}

export interface MapElevation {
	ele: number;
}

export type MapGpxPoint = MapLocation & MapElevation;

export type MapGpxPoints = MapGpxPoint[];

export type MapAnnotation = {
	location: MapLocation;
	title: string;
} & Pick<URL, 'pathname'>;

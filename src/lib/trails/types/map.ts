export interface MapLocation {
	lat: number;
	lon: number;
}

export type MapGpxPointId = `${string}-${string}-${string}-${string}-${string}`;

export type MapGpxPoint = MapLocation & { id: MapGpxPointId; ele: number; distance: number };

export type MapGpxPoints = MapGpxPoint[];

export type MapAnnotation = {
	location: MapLocation;
	title: string;
} & Pick<URL, 'pathname'>;

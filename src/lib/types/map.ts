export interface MapLocation {
	lat: number;
	lon: number;
}

export type MapAnnotation = {
	location: MapLocation;
	title: string;
} & Pick<URL, 'pathname'>;

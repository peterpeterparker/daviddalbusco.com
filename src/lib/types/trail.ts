export type Sport = 'trail' | 'bike' | 'gravel';

export interface TrailMetadata {
	title: string;
	date: string;
	image: string;
	sport: Sport;
}

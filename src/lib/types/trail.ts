import type { DateString } from '$lib/types/date';

export type Sport = 'trail' | 'bike' | 'gravel';

export interface TrailMetadata {
	title: string;
	date: DateString;
	image: string;
	sport: Sport;
}

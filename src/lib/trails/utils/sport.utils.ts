import type { Sport } from '$lib/trails/types/trail';

export const sportColor = (sport: Sport): string =>
	sport === 'gravel' ? '#5f00ba' : sport === 'cycling' ? '#009fb7' : '#ff65a9';

import type { DateString } from '$lib/core/types/date';

export interface BlogMetadata {
	title: string;
	description: string;
	date: DateString;
	tags: string;
	image: string;
	canonical: string;
	robots?: 'disallow';
	standard_site?: string;
}

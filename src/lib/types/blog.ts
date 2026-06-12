export interface BlogMetadata {
	title: string;
	description: string;
	date: string;
	tags: string;
	image: string;
	canonical: string;
	robots?: 'disallow';
	standard_site?: string;
}

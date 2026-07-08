export type SlugPath = 'portfolio' | 'blog' | 'trails';

export interface Slug {
	name: string; // Blog post name, trail name etc.
	group?: string; // e.g. year 2026
}

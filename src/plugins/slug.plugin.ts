import type { Slug, SlugPath } from '$lib/core/types/slug';
import { readdirSync } from 'fs';
import { parse } from 'path';

export const listSlugs = ({ path }: { path: SlugPath }): Slug[] => {
	return readdirSync(`src/${path}`)
		.filter((fileName) => /.+\.md$/.test(fileName))
		.map((fileName) => ({
			slug: parse(fileName).name
		}));
};

import type { Slug, SlugPath } from '$lib/core/types/slug';
import { readdirSync } from 'node:fs';
import { parse } from 'node:path';

export const listSlugs = ({ path }: { path: SlugPath }): Slug[] => {
	return readdirSync(`src/${path}`, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && /.+\.md$/.test(entry.name))
		.map((entry) => {
			const { name: parentName } = parse(entry.parentPath);
			const { name: fileName } = parse(entry.name);

			return {
				name: fileName,
				...(parentName !== path && { group: parentName })
			};
		});
};

import type { Slug } from '#lib/core/types/slug.js';
import { notEmptyString } from '#lib/core/utils/nullish.utils.js';

export const toSlugPath = (slug: Slug): string =>
	`${notEmptyString(slug.group) ? `${slug.group}/` : ''}${slug.name}`;

import type { Slug } from '$lib/core/types/slug';
import { notEmptyString } from '$lib/core/utils/nullish.utils';

export const toSlugPath = (slug: Slug): string =>
	`${notEmptyString(slug.group) ? `${slug.group}/` : ''}${slug.name}`;

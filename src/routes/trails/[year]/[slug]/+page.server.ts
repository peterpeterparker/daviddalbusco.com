import type { PageData } from '#lib/core/types/page.js';
import { isEmptyString } from '#lib/core/utils/nullish.utils.js';
import type { Trail } from '#lib/trails/types/trail.js';
import { getTrail } from '#plugins/trails.plugin.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params: { slug, year }
}): Promise<{ trail: PageData<Trail> }> => {
	if (isEmptyString(year)) {
		error(404, 'Not found');
	}

	if (isEmptyString(slug)) {
		error(404, 'Not found');
	}

	const trail = await getTrail({ group: year, slug });
	return { trail };
};

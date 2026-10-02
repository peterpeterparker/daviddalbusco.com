import type { PageDataWithoutContent } from '#lib/core/types/page.js';
import { isEmptyString } from '#lib/core/utils/nullish.utils.js';
import type { Trail } from '#lib/trails/types/trail.js';
import { listTrails } from '$plugins/trails.plugin';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params: { year }
}): Promise<{
	trails: PageDataWithoutContent<Trail>[];
}> => {
	if (isEmptyString(year)) {
		error(404, 'Not found');
	}

	const trails = await listTrails({ year });
	return { trails: trails.map(({ content: _, ...rest }) => rest) };
};

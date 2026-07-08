import type { PageData } from '$lib/core/types/page';
import { isEmptyString } from '$lib/core/utils/nullish.utils';
import type { Trail } from '$lib/trails/types/trail';
import { getTrail } from '$plugins/trails.plugin';
import { error } from '@sveltejs/kit';

export const load = async ({
	params: { slug, year }
}: {
	params: Record<string, string>;
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

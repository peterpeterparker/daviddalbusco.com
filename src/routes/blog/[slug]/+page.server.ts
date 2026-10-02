import type { BlogMetadata } from '#lib/blog/types/blog.js';
import type { PageData } from '#lib/core/types/page.js';
import { isEmptyString } from '#lib/core/utils/nullish.utils.js';
import { getBlob } from '#plugins/blog.plugin.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params: { slug }
}): Promise<{ post: PageData<BlogMetadata> }> => {
	if (isEmptyString(slug)) {
		error(404, 'Not found');
	}

	const post = await getBlob({ slug });
	return { post };
};

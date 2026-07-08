import type { BlogMetadata } from '$lib/blog/types/blog';
import type { PageData } from '$lib/core/types/page';
import { isEmptyString } from '$lib/core/utils/nullish.utils';
import { getBlob } from '$plugins/blog.plugin';
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

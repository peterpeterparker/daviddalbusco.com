import type { BlogMetadata } from '$lib/types/blog';
import type { PageData } from '$lib/types/page';
import { getBlob } from '$plugins/blog.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ post: PageData<BlogMetadata> }> => {
	const post = await getBlob(params);
	return { post };
};

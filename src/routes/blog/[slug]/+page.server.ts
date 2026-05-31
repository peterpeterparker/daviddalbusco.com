import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';
import { getBlob } from '$plugins/blog.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ post: MarkdownData<BlogMetadata> }> => {
	const post = await getBlob(params);
	return { post };
};

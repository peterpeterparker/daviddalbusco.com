import { getBlob } from '$lib/plugins/blog.plugin';
import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ post: MarkdownData<BlogMetadata> }> => {
	const post = await getBlob(params);
	return { post };
};

import type { BlogMetadata } from '$lib/blog/types/blog';
import type { PageDataWithoutContent } from '$lib/core/types/page';
import { listBlog } from '$plugins/blog.plugin';

export const load = async (): Promise<{ posts: PageDataWithoutContent<BlogMetadata>[] }> => {
	const posts = await listBlog();
	return { posts: posts.map(({ content: _, ...rest }) => rest) };
};

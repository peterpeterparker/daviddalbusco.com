import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
import { listBlog } from '$plugins/blog.plugin';

export const load = async (): Promise<{ posts: MarkdownDataWithoutContent<BlogMetadata>[] }> => {
	const posts = await listBlog();
	return { posts: posts.map(({ content: _, ...rest }) => rest) };
};

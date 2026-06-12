import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';
import { listBlog } from '$plugins/blog.plugin';

export const load = async (): Promise<{ posts: Omit<MarkdownData<BlogMetadata>, 'content'>[] }> => {
	const posts = await listBlog();
	return { posts: posts.map(({ content: _, ...rest }) => rest) };
};

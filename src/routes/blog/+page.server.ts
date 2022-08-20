import {listBlog} from '$lib/plugins/blog.plugin';
import type {BlogMetadata} from '$lib/types/blog';
import type {MarkdownData} from '$lib/types/markdown';

export const load = async (): Promise<{posts: MarkdownData<BlogMetadata>[]}> => {
  const posts = await listBlog();
  return {posts};
};

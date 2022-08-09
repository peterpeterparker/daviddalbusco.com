import {listBlog} from '$lib/plugins/blog.plugin';
import type {BlogMetadata} from '$lib/types/blog';
import type {MarkdownData} from '$lib/types/markdown';
import type {ResponseBody} from '@sveltejs/kit';

export const GET = async (): Promise<ResponseBody> => {
  const result: MarkdownData<BlogMetadata>[] = await listBlog();
  return {
    body: JSON.stringify(result)
  };
};

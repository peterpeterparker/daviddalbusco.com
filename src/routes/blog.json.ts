import {listBlog} from '$lib/plugins/blog.plugin';
import type {BlogMetadata} from '$lib/types/blog';
import type {MarkdownData} from '$lib/types/markdown';
import type {EndpointOutput} from '@sveltejs/kit';

export const get = async (): Promise<EndpointOutput> => {
  const result: MarkdownData<BlogMetadata>[] = await listBlog();
  return {
    body: JSON.stringify(result)
  };
};

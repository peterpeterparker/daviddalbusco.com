import {listBlog} from '$lib/plugins/blog.plugin';
import {listPortfolio} from '$lib/plugins/portfolio.plugin';
import type {BlogMetadata} from '$lib/types/blog';
import type {MarkdownData} from '$lib/types/markdown';
import type {Portfolio} from '$lib/types/portfolio';
import type {ResponseBody} from '@sveltejs/kit';

export const GET = async (): Promise<ResponseBody> => {
  const portfolio: Portfolio = await listPortfolio();
  const blog: MarkdownData<BlogMetadata>[] = await listBlog();

  return {
    body: JSON.stringify({
      portfolio,
      blog: blog.slice(0, 4)
    })
  };
};

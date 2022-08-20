import {get, list} from '$lib/plugins/markdown.plugin';
import type {BlogMetadata} from '$lib/types/blog';
import type {MarkdownData} from '$lib/types/markdown';

export const listBlog = async (): Promise<MarkdownData<BlogMetadata>[]> => {
  const results: MarkdownData<BlogMetadata>[] = await list<BlogMetadata>({path: 'blog'});

  const sortBlogs: MarkdownData<BlogMetadata>[] = results.sort(
    ({metadata: a}: MarkdownData<BlogMetadata>, {metadata: b}: MarkdownData<BlogMetadata>) => {
      const timeA: number = new Date(a.date).getTime();
      const timeB: number = new Date(b.date).getTime();

      return timeA < timeB ? 1 : -1;
    }
  );

  return sortBlogs;
};

export const getBlob = async ({slug}: Record<string, string>): Promise<MarkdownData<BlogMetadata>> =>
  get<BlogMetadata>({slug, path: 'blog'});

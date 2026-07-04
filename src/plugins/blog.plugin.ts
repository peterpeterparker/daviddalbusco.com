import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';
import { get, list } from '$plugins/markdown.plugin';

export const listBlog = async (): Promise<MarkdownData<BlogMetadata>[]> => {
	const results = await list<BlogMetadata>({ path: 'blog' });

	return results.sort(({ metadata: { date: dateA } }, { metadata: { date: dateB } }) => {
		const timeA = new Date(dateA).getTime();
		const timeB = new Date(dateB).getTime();

		return timeB - timeA;
	});
};

export const getBlob = ({ slug }: Record<string, string>): Promise<MarkdownData<BlogMetadata>> =>
	get<BlogMetadata>({ slug, path: 'blog' });

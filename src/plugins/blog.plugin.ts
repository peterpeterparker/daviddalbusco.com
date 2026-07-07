import type { BlogMetadata } from '$lib/blog/types/blog';
import type { PageData } from '$lib/core/types/page';
import { get, list } from '$plugins/markdown.plugin';

export const listBlog = async (): Promise<PageData<BlogMetadata>[]> => {
	const results = await list<BlogMetadata>({ path: 'blog' });

	return results.sort(({ metadata: { date: dateA } }, { metadata: { date: dateB } }) => {
		const timeA = new Date(dateA).getTime();
		const timeB = new Date(dateB).getTime();

		return timeB - timeA;
	});
};

export const getBlob = ({ slug }: Record<string, string>): Promise<PageData<BlogMetadata>> =>
	get<BlogMetadata>({ slug, path: 'blog' });

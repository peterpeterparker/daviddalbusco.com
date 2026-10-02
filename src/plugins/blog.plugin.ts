import type { BlogMetadata } from '#lib/blog/types/blog.js';
import type { PageData } from '#lib/core/types/page.js';
import { get, type GetPageData, list } from '#plugins/markdown.plugin.js';

export const listBlog = async (): Promise<PageData<BlogMetadata>[]> => {
	const results = await list<BlogMetadata>({ path: 'blog' });

	return results.sort(({ metadata: { date: dateA } }, { metadata: { date: dateB } }) => {
		const timeA = new Date(dateA).getTime();
		const timeB = new Date(dateB).getTime();

		return timeB - timeA;
	});
};

export const getBlob = ({ slug }: Pick<GetPageData, 'slug'>): Promise<PageData<BlogMetadata>> =>
	get<BlogMetadata>({ slug, path: 'blog' });

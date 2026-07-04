import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';
import { get, list } from '$plugins/markdown.plugin';
import type { TrailMetadata } from '$lib/types/trail';

export const listTrails = async (): Promise<MarkdownData<TrailMetadata>[]> => {
	const results = await list<BlogMetadata>({ path: 'trails' });

	return results.sort(({ metadata: { date: dateA } }, { metadata: { date: dateB } }) => {
		const timeA = new Date(dateA).getTime();
		const timeB = new Date(dateB).getTime();

		return timeB - timeA;
	});
};

export const getBlob = ({ slug }: Record<string, string>): Promise<MarkdownData<BlogMetadata>> =>
	get<BlogMetadata>({ slug, path: 'blog' });

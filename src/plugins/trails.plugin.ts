import type { MarkdownData } from '$lib/types/markdown';
import type { TrailMetadata } from '$lib/types/trail';
import { get, list } from '$plugins/markdown.plugin';

export const listTrails = async (): Promise<MarkdownData<TrailMetadata>[]> => {
	const results = await list<TrailMetadata>({ path: 'trails' });

	return results.sort(({ metadata: { date: dateA } }, { metadata: { date: dateB } }) => {
		const timeA = new Date(dateA).getTime();
		const timeB = new Date(dateB).getTime();

		return timeB - timeA;
	});
};

export const getTrail = ({ slug }: Record<string, string>): Promise<MarkdownData<TrailMetadata>> =>
	get<TrailMetadata>({ slug, path: 'trails' });

import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
import type { TrailMetadata } from '$lib/types/trail';
import { listTrails } from '$plugins/trails.plugin';

export const load = async (): Promise<{ trails: MarkdownDataWithoutContent<TrailMetadata>[] }> => {
	const trails = await listTrails();
	return { trails: trails.map(({ content: _, ...rest }) => rest) };
};

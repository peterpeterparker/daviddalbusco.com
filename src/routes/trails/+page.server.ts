import type { MarkdownDataWithoutContent } from '$lib/types/markdown';
import type { Trail } from '$lib/types/trail';
import { listTrails } from '$plugins/trails.plugin';

export const load = async (): Promise<{ trails: MarkdownDataWithoutContent<Trail>[] }> => {
	const trails = await listTrails();
	return { trails: trails.map(({ content: _, ...rest }) => rest) };
};

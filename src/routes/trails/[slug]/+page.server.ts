import type { MarkdownData } from '$lib/types/markdown';
import type { TrailMetadata } from '$lib/types/trail';
import { getTrail } from '$plugins/trails.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ trail: MarkdownData<TrailMetadata> }> => {
	const trail = await getTrail(params);
	return { trail };
};

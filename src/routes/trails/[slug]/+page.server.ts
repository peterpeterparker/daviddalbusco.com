import type { MarkdownData } from '$lib/types/markdown';
import type { TrailMetadata } from '$lib/types/trail';
import { getTrail } from '$plugins/trails.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ post: MarkdownData<TrailMetadata> }> => {
	const post = await getTrail(params);
	return { post };
};

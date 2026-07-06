import type { PageData } from '$lib/types/page';
import type { TrailMetadata } from '$lib/types/trail';
import { getTrail } from '$plugins/trails.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ trail: PageData<TrailMetadata> }> => {
	const trail = await getTrail(params);
	return { trail };
};

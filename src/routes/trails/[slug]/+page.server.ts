import type { Trail } from '$lib/trails/types/trail';
import type { PageData } from '$lib/types/page';
import { getTrail } from '$plugins/trails.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ trail: PageData<Trail> }> => {
	const trail = await getTrail(params);
	return { trail };
};

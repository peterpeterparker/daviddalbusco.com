import type { PageDataWithoutContent } from '$lib/core/types/page';
import type { Trail } from '$lib/trails/types/trail';
import { listTrails } from '$plugins/trails.plugin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<{
	trails: PageDataWithoutContent<Trail>[];
}> => {
	const trails = await listTrails();
	return { trails: trails.map(({ content: _, ...rest }) => rest) };
};

import type { Trail } from '$lib/trails/types/trail';
import type { PageDataWithoutContent } from '$lib/types/page';
import { listTrails } from '$plugins/trails.plugin';

export const load = async (): Promise<{ trails: PageDataWithoutContent<Trail>[] }> => {
	const trails = await listTrails();
	return { trails: trails.map(({ content: _, ...rest }) => rest) };
};

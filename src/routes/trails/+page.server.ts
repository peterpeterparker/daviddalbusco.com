import type { PageDataWithoutContent } from '$lib/types/page';
import type { Trail } from '$lib/types/trail';
import { listTrails } from '$plugins/trails.plugin';

export const load = async (): Promise<{ trails: PageDataWithoutContent<Trail>[] }> => {
	const trails = await listTrails();
	return { trails: trails.map(({ content: _, ...rest }) => rest) };
};

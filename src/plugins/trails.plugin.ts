import type { Trail, TrailMetadata } from '$lib/trails/types/trail';
import type { PageData } from '$lib/types/page';
import { get, list } from '$plugins/markdown.plugin';
import { getTrack } from '$plugins/track.plugin';

export const listTrails = async (): Promise<PageData<Trail>[]> => {
	const trails = await list<TrailMetadata>({ path: 'trails' });

	const results = await Promise.all(trails.map(populateMetadata));

	return results.sort(
		(
			{
				metadata: {
					metadata: { date: dateA }
				}
			},
			{
				metadata: {
					metadata: { date: dateB }
				}
			}
		) => {
			const timeA = new Date(dateA).getTime();
			const timeB = new Date(dateB).getTime();

			return timeB - timeA;
		}
	);
};

export const getTrail = async ({ slug }: Record<string, string>): Promise<PageData<Trail>> => {
	const metadata = await get<TrailMetadata>({ slug, path: 'trails' });
	return await populateMetadata(metadata);
};

const populateMetadata = async ({
	metadata,
	...rest
}: PageData<TrailMetadata>): Promise<PageData<Trail>> => {
	const track = await getTrack(metadata);

	return {
		...rest,
		metadata: {
			metadata,
			track
		}
	};
};

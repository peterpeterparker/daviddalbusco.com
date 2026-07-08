import type { PageData } from '$lib/core/types/page';
import type { Trail, TrailMetadata } from '$lib/trails/types/trail';
import { get, type GetPageData, list } from '$plugins/markdown.plugin';
import { getTrack } from '$plugins/track.plugin';

export const listTrails = async (
	{ year }: { year: string | undefined } = { year: undefined }
): Promise<PageData<Trail>[]> => {
	const trails = await list<TrailMetadata>({ path: 'trails', subPath: year });

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

export const getTrail = async (
	args: Pick<GetPageData, 'slug' | 'group'>
): Promise<PageData<Trail>> => {
	const metadata = await get<TrailMetadata>({ ...args, path: 'trails' });
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

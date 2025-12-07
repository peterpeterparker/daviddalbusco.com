import { defineRun } from '@junobuild/config';
import { type Asset, listAssets, type SatelliteOptions, uploadBlob } from '@junobuild/core';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const COLLECTION_ASSETS = 'assets';
const FULL_PATH_PREFIX = `/${COLLECTION_ASSETS}/images/`;

const PAGINATION = 100;

export const onRun = defineRun(() => ({
	run: async ({ satelliteId, identity }) => {
		const satellite = {
			satelliteId: satelliteId.toText(),
			identity
		};

		const assets = await listContentAssets({
			satellite
		});

		const existingImages = new Set(
			assets
				.filter(({ fullPath }) => fullPath.startsWith(FULL_PATH_PREFIX))
				.map((asset) => asset.fullPath.replace(FULL_PATH_PREFIX, ''))
		);

		const images = await readdir(join(process.cwd(), 'assets', 'images'));

		const imagesToUpload = images.filter((img) => !existingImages.has(img));

		console.log(`Found ${images.length} images locally`);
		console.log(`Found ${existingImages.size} images already uploaded`);

		if (imagesToUpload.length === 0) {
			console.log('✨ Nothing to upload, all images are already synced!');
			return;
		}

		console.log(`Need to upload ${imagesToUpload.length} new images`);

		await uploadImages({ images: imagesToUpload, satellite });

		console.log(`\n✨ Upload complete!`);
	}
}));

const uploadImages = async ({
	satellite,
	images
}: {
	satellite: SatelliteOptions;
	images: string[];
}) => {
	for (const image of images) {
		console.log(`Uploading: ${image}`);

		try {
			const filePath = join(COLLECTION_ASSETS, 'images', image);
			const fileBuffer = await readFile(filePath);

			const ext = image.split('.').pop()?.toLowerCase();
			const contentType =
				ext === 'jpg' || ext === 'jpeg'
					? 'image/jpeg'
					: ext === 'png'
						? 'image/png'
						: ext === 'gif'
							? 'image/gif'
							: ext === 'webp'
								? 'image/webp'
								: ext === 'svg'
									? 'image/svg+xml'
									: 'application/octet-stream';

			const data = new Blob([fileBuffer], { type: contentType });

			await uploadBlob({
				data,
				filename: image,
				fullPath: `${FULL_PATH_PREFIX}${image}`,
				collection: COLLECTION_ASSETS,
				headers: [
					['Content-Type', contentType],
					['Cache-Control', 'public, max-age=31536000, immutable']
				],
				satellite
			});

			console.log(`✅ Uploaded: ${image}`);
		} catch (error) {
			console.error(`❌ Failed to upload ${image}:`, error);
		}
	}
};

const listContentAssets = async ({
	startAfter,
	satellite
}: {
	startAfter?: string;
	satellite: SatelliteOptions;
}): Promise<Asset[]> => {
	const { items, items_page, matches_pages } = await listAssets({
		collection: COLLECTION_ASSETS,
		satellite,
		filter: {
			order: {
				desc: true,
				field: 'keys'
			},
			paginate: {
				startAfter,
				limit: PAGINATION
			}
		}
	});

	if ((items_page ?? 0n) < (matches_pages ?? 0n)) {
		const nextItems = await listContentAssets({
			startAfter: last(items)?.fullPath,
			satellite
		});
		return [...items, ...nextItems];
	}

	return items;
};

const last = <T>(elements: T[]): T | undefined => {
	const { length, [length - 1]: last } = elements;
	return last;
};

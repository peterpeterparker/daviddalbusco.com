import { env } from '$env/dynamic/public';
import { type Result, safeExec } from '$lib/utils/fn.utils';
import { type MapKit as AppleMapKit, load, type Map } from '@apple/mapkit-loader';

// https://developer.apple.com/documentation/mapkitjs/loading-the-latest-version-of-mapkit-js#Select-MapKit-JS-libraries
type Libraries =
	| 'services'
	| 'full-map'
	| 'map'
	| 'overlays'
	| 'annotations'
	| 'geojson'
	| 'user-location'
	| 'look-around';

const LIBRARIES: [Libraries, ...Libraries[]] = ['map', 'annotations', 'overlays'];

export interface MapKit {
	mapkit: AppleMapKit;
	map: Map;
}

export const loadMap = async (args: { anchor: HTMLElement }): Promise<Result<MapKit>> => {
	return await safeExec(async () => {
		return await loadMapKit(args);
	});
};

const loadMapKit = async ({ anchor }: { anchor: HTMLElement }): Promise<MapKit> => {
	const mapkit = await load({
		libraries: LIBRARIES,
		token: env.PUBLIC_MAPKIT_TOKEN
	});

	const map = new mapkit.Map(anchor);

	return {
		mapkit,
		map
	};
};

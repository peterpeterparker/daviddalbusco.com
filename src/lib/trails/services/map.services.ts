import { env } from '$env/dynamic/public';
import { type Result, safeExec } from '$lib/core/utils/fn.utils';
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
		const token = await initToken();
		return await loadMapKit({ ...args, ...token });
	});
};

const loadMapKit = async ({
	anchor,
	token
}: {
	anchor: HTMLElement;
	token: string;
}): Promise<MapKit> => {
	const mapkit = await load({
		libraries: LIBRARIES,
		token
	});

	const map = new mapkit.Map(anchor);

	return {
		mapkit,
		map
	};
};

interface ApiMapKitToken {
	token: string;
}

const initToken = async (): Promise<ApiMapKitToken> => {
	// e.g. for local development
	if (env.PUBLIC_MAPKIT_TOKEN !== undefined) {
		return { token: env.PUBLIC_MAPKIT_TOKEN };
	}

	return await loadToken();
};

const loadToken = async (): Promise<ApiMapKitToken> => {
	const response = await fetch('/api/mapkit/token');

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`${response.status} ${text}`);
	}

	return await response.json();
};

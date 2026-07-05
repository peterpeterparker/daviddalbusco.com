<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { load, type Map, type MapKit } from '@apple/mapkit-loader';
	import { env } from '$env/dynamic/public';
    import type {MapAnnotation, MapGpxPoints} from '$lib/types/map';

	// References:
	// https://webkit.org/blog/18027/discover-mapkit-js-6-rebuilt-for-todays-web-developer/
	// https://github.com/apple/mapkit-loader/blob/main/src/index.ts

	interface Props {
		annotations?: MapAnnotation[];
        points?: MapGpxPoints | null;
	}

	let { annotations, points }: Props = $props();

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

	let kit = $state<{ mapkit: MapKit; map: Map } | undefined>(undefined);

	const loadMap = async ({ anchor }: { anchor: HTMLElement }) => {
		const mapkit = await load({
			libraries: LIBRARIES,
			token: env.PUBLIC_MAPKIT_TOKEN
		});

		const map = new mapkit.Map(anchor);

		kit = {
			mapkit,
			map
		};
	};

	const attachMap: Attachment<HTMLElement> = (element) => {
		// Unawaited promise. @attach does not support promises but, not relevant here
		loadMap({ anchor: element });
	};

	$effect(() => {
		if (kit === undefined) {
			return;
		}

        const {mapkit, map} = kit;

		if (map.annotations !== null) {
			map.removeAnnotations(map.annotations);
		}

        if (annotations === undefined) {
            return;
        }

		const markers = annotations.map(
			({ location: { lat, lon }, title, pathname }) =>
				new mapkit.MarkerAnnotation(new mapkit.Coordinate(lat, lon), {
					title,
					callout: {
						calloutContentForAnnotation: () => {
							const link = document.createElement('a');
							link.href = pathname;
							link.textContent = `View ${title}`;
							return link;
						}
					}
				})
		);

		map.addAnnotations(markers);

        centerMap();
	});

    $effect(() => {
        if (kit === undefined) {
            return;
        }

        if (points === undefined || points === null) {
            return;
        }

        const {mapkit, map} = kit;

        if (map.overlays !== null) {
            map.removeOverlays(map.overlays);
        }

        const coordinates = points.map(({ lat, lon }) => new mapkit.Coordinate(lat, lon));

        const route = new mapkit.PolylineOverlay(coordinates, {
            style: new mapkit.Style({
                lineWidth: 4,
                strokeColor: '#ff65a9',
                lineJoin: 'round',
                lineCap: 'round'
            })
        });

        map.addOverlay(route);

        centerMap();
    });

    const centerMap = () => {
        if (kit === undefined) {
            return;
        }

        const { map } = kit;

        const items = [...(map.annotations ?? []), ...(map.overlays ?? [])];

        if (items.length > 0) {
            map.showItems(items);
        }
    }
</script>

<article {@attach attachMap}></article>

<style lang="scss">
	article {
		width: 100%;
		aspect-ratio: 16/9;
		background: rgba(var(--color-primary-rgb), 0.2);
		border: 0.25rem solid black;
	}
</style>

<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { load } from '@apple/mapkit-loader';
	import { env } from '$env/dynamic/public';
	import type { MapAnnotation } from '$lib/types/map';

	// References:
	// https://webkit.org/blog/18027/discover-mapkit-js-6-rebuilt-for-todays-web-developer/
	// https://github.com/apple/mapkit-loader/blob/main/src/index.ts

	interface Props {
		annotations: MapAnnotation[];
	}

	let { annotations }: Props = $props();

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

	const loadMap = async ({ anchor }: { anchor: HTMLElement }) => {
		const mapkit = await load({
			libraries: LIBRARIES,
			token: env.PUBLIC_MAPKIT_TOKEN
		});

		const map = new mapkit.Map(anchor);

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
		map.showItems(markers);
	};

	const attachMap: Attachment<HTMLElement> = (element) => {
		// Unawaited promise. @attach does not support promises but, not relevant here
		loadMap({ anchor: element });
	};
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

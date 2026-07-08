<script lang="ts" module>
	import type { MapAnnotation } from '$lib/trails/types/map';

	export interface ShowItemsBoundary {
		min: MapLocation;
		max: MapLocation;
	}
</script>

<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { MarkerAnnotation, Annotation } from '@apple/mapkit-loader';
	import type { MapGpxPointId, MapGpxPoints, MapLocation } from '$lib/trails/types/map';
	import { loadMap, type MapKit } from '$lib/trails/services/map.services';

	// References:
	// https://webkit.org/blog/18027/discover-mapkit-js-6-rebuilt-for-todays-web-developer/
	// https://github.com/apple/mapkit-loader/blob/main/src/index.ts

	interface Props {
		annotations?: MapAnnotation[];
		points?: MapGpxPoints | null;
		selectedPointId?: MapGpxPointId;
		showItemsBoundary?: ShowItemsBoundary;
	}

	let { annotations, points, selectedPointId, showItemsBoundary }: Props = $props();

	let kit = $state<MapKit | undefined>(undefined);

	const attachMap: Attachment<HTMLElement> = (element) => {
		// Unawaited promise. @attach does not support promises but, not relevant here
		loadMap({ anchor: element }).then((result) => {
			if (result.status === 'error') {
				console.error('Unexpected error while loading the map', result.err);
				return;
			}

			kit = result.result;
		});
	};

	$effect(() => {
		if (kit === undefined) {
			return;
		}

		const { mapkit, map } = kit;

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

		focusItems();
	});

	$effect(() => {
		if (kit === undefined) {
			return;
		}

		if (points === undefined || points === null) {
			return;
		}

		const { mapkit, map } = kit;

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

		focusItems();
	});

	// Not a state on purpose. Used for logic not rendering.
	let selectedPoint: MarkerAnnotation | undefined | null = undefined;

	$effect(() => {
		if (kit === undefined) {
			return;
		}

		if (points === undefined || points === null) {
			return;
		}

		const { mapkit, map } = kit;

		const clear = () => {
			if (selectedPoint !== undefined && selectedPoint !== null) {
				map.removeAnnotation(selectedPoint);
				selectedPoint = null;
			}
		};

		if (selectedPointId === undefined) {
			clear();
			return;
		}

		const point = points.find(({ id }) => id === selectedPointId);

		if (point === undefined) {
			return;
		}

		const coordinate = new mapkit.Coordinate(point.lat, point.lon);

		if (selectedPoint === undefined || selectedPoint === null) {
			selectedPoint = new mapkit.MarkerAnnotation(coordinate, {
				color: '#ff65a9',
				glyphText: '●'
			});

			map.addAnnotation(selectedPoint);

			return;
		}

		selectedPoint.coordinate = coordinate;
	});

	const focusItems = () => {
		if (kit === undefined) {
			return;
		}

		const { map } = kit;

		const filterAnnotations = (annotation: Annotation): boolean =>
			showItemsBoundary === undefined ||
			(annotation.coordinate.latitude >= showItemsBoundary.min.lat &&
				annotation.coordinate.latitude <= showItemsBoundary.max.lat &&
				annotation.coordinate.longitude >= showItemsBoundary.min.lon &&
				annotation.coordinate.longitude <= showItemsBoundary.max.lon);

		const items = [...(map.annotations ?? []).filter(filterAnnotations), ...(map.overlays ?? [])];

		if (items.length > 0) {
			map.showItems(items);
		}
	};
</script>

<article {@attach attachMap}></article>

<style lang="scss">
	article {
		width: 100%;
		aspect-ratio: var(--map-aspect-ratio, 16/9);
		background: rgba(var(--color-primary-rgb), 0.2);
		border: 0.25rem solid black;
	}
</style>

import type { Thing } from 'schema-dts';

export const renderJsonLDScriptTag = (thing: Thing): string =>
	`<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;

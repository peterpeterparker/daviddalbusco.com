import type { ExportedHandler } from 'kyushu-types';

export default {
	async fetch(request, env) {
		const responseFromMemory = await env.ASSETS.fetch(request);

		if (responseFromMemory.status !== 404) {
			return responseFromMemory;
		}

		return await env.ASSETS.fetch(request, { src: 'fs' });
	}
} satisfies ExportedHandler;

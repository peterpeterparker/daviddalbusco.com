import type { ExportedHandler } from 'kyushu-types';
import { extname } from 'node:path';

const ADDITIONAL_HEADERS: Record<string, [string, ...string[]]> = {
	'.png': ['public', 'max-age=31536000', 'immutable'],
	'.webp': ['public', 'max-age=31536000', 'immutable'],
	'.jpg': ['public', 'max-age=31536000', 'immutable']
};

const fetchAsset: ExportedHandler['fetch'] = async (request, env) => {
	const responseFromMemory = await env.ASSETS.fetch(request);

	if (responseFromMemory.status !== 404) {
		return responseFromMemory;
	}

	return await env.ASSETS.fetch(request, { src: 'fs' });
};

export default {
	async fetch(request, env) {
		const { headers, ...rest } = await fetchAsset(request, env);

		const { pathname } = URL.parse(request.url) ?? { pathname: undefined };
		const cache = pathname !== undefined ? ADDITIONAL_HEADERS[extname(pathname)] : undefined;

		return {
			...rest,
			headers: {
				...headers,
				...(cache !== undefined && { 'cache-control': cache.join(', ') })
			}
		};
	}
} satisfies ExportedHandler;

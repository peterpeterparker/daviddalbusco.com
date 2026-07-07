import type { ExportedHandler } from 'kyushu-types';
import { extname } from 'node:path';

const ADDITIONAL_HEADERS: Record<string, [string, ...string[]]> = {
	'.png': ['public', 'max-age=31536000', 'immutable'],
	'.webp': ['public', 'max-age=31536000', 'immutable'],
	'.jpg': ['public', 'max-age=31536000', 'immutable']
};

const ALLOWED_ORIGINS: Record<string, [string, ...string[]]> = {
	'.gpx': ['https://daviddalbusco.com', 'https://www.daviddalbusco.com']
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

		const origin = request.headers?.origin;
		const allowedOrigin =
			origin !== undefined && pathname !== undefined
				? ALLOWED_ORIGINS[extname(pathname)]?.includes(origin) === true
					? origin
					: undefined
				: undefined;

		return {
			...rest,
			headers: {
				...headers,
				...(cache !== undefined && { 'cache-control': cache.join(', ') }),
				...(allowedOrigin !== undefined && { 'access-control-allow-origin': allowedOrigin })
			}
		};
	}
} satisfies ExportedHandler;

import type { ExportedHandler, WorkerRequest } from 'kyushu-types';
import { extname } from 'node:path';

const ADDITIONAL_HEADERS: Record<string, [string, ...string[]]> = {
	'.png': ['public', 'max-age=31536000', 'immutable'],
	'.webp': ['public', 'max-age=31536000', 'immutable'],
	'.jpg': ['public', 'max-age=31536000', 'immutable']
};

const ALLOWED_ASSETS_CORS: Record<string, [string, ...string[]]> = {
	'.gpx': ['daviddalbusco.com', 'www.daviddalbusco.com']
};

const resolveHost = (request: WorkerRequest): string | undefined =>
	request.headers?.['x-forwarded-host'] ?? request.headers?.host;

const fetchAsset: ExportedHandler['fetch'] = async (request, env) => {
	const responseFromMemory = await env.ASSETS.fetch(request);

	if (responseFromMemory.status !== 404) {
		return responseFromMemory;
	}

	return await env.ASSETS.fetch(request, { src: 'fs' });
};

const fetchMapkitToken: ExportedHandler['fetch'] = async (request) => {
	const host = resolveHost(request);

	if (host === undefined) {
		return {
			status: 405,
			body: 'Method Not Allowed'
		};
	}

	const MAPKIT_TOKENS: Record<string, string | undefined> = {
		'daviddalbusco.com': process.env.MAPKIT_TOKEN_ROOT,
		'www.daviddalbusco.com': process.env.MAPKIT_TOKEN_WWW
	};

	const token = MAPKIT_TOKENS[host];

	if (token === undefined) {
		return {
			status: 403,
			body: 'Forbidden'
		};
	}

	return {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store'
		},
		body: JSON.stringify({ token })
	};
};

export default {
	async fetch(request, env) {
		const { pathname, protocol } = URL.parse(request.url) ?? {
			pathname: undefined,
			protocol: 'https:'
		};

		if (request.method === 'GET' && pathname === '/api/mapkit/token') {
			return await fetchMapkitToken(request, env);
		}

		const { headers, ...rest } = await fetchAsset(request, env);

		const cache = pathname !== undefined ? ADDITIONAL_HEADERS[extname(pathname)] : undefined;

		const host = resolveHost(request);
		const allowedHost =
			host !== undefined && pathname !== undefined
				? ALLOWED_ASSETS_CORS[extname(pathname)]?.includes(host) === true
					? host
					: undefined
				: undefined;

		return {
			...rest,
			headers: {
				...headers,
				...(cache !== undefined && { 'cache-control': cache.join(', ') }),
				...(allowedHost !== undefined && {
					'access-control-allow-origin': `${protocol}//${allowedHost}`
				})
			}
		};
	}
} satisfies ExportedHandler;

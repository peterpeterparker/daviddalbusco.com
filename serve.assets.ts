import { join } from 'node:path';

const BASE_PATH = './assets';
const PORT = 3000;

Bun.serve({
	port: PORT,
	async fetch({ url }) {
		const { pathname } = new URL(url);
		const filePath = join(BASE_PATH, pathname);
		const file = Bun.file(filePath);
		return new Response(file);
	},
	error(error) {
		return new Response(`Error: ${error.message}`, { status: 404 });
	}
});

console.log(`Assets served from ${BASE_PATH} on http://localhost:${PORT}`);

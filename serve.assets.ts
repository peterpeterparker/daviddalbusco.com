const BASE_PATH = './assets';

Bun.serve({
	port: 3000,
	async fetch(req) {
		const filePath = BASE_PATH + new URL(req.url).pathname;
		const file = Bun.file(filePath);
		return new Response(file);
	},
	error() {
		return new Response(null, { status: 404 });
	}
});

console.log(`Assets served from ${BASE_PATH} on http://localhost:3000`);

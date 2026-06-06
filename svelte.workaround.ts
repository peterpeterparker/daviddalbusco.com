import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

// TODO: a workaround for SvelteKit issue https://github.com/sveltejs/kit/issues/15935

const output = join(process.cwd(), 'build');
const files = await readdir(output, { recursive: true });
const htmlFiles = files.filter((file) => extname(file) === '.html');

const update = async (fileRelativePath: string) => {
	const filePath = join(output, fileRelativePath);
	const content = await readFile(filePath, 'utf8');
	const cleanedContent = content.replaceAll(
		'site.standard.publication external',
		'site.standard.publication'
	);
	await writeFile(filePath, cleanedContent, 'utf-8');
};

await Promise.all(htmlFiles.map(update));

console.log('✅ Meta tag site.standard.publication updated.');

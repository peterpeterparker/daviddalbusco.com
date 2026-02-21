import { env } from '$env/dynamic/public';
import { listSlugs } from '$lib/plugins/slug.plugin';
import type { MarkdownData } from '$lib/types/markdown';
import type { Slug } from '$lib/types/slug';
import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import html from '@shikijs/langs/html';
import javascript from '@shikijs/langs/javascript';
import json from '@shikijs/langs/json';
import markdown from '@shikijs/langs/markdown';
import rust from '@shikijs/langs/rust';
import sass from '@shikijs/langs/sass';
import scss from '@shikijs/langs/scss';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import xml from '@shikijs/langs/xml';
import yaml from '@shikijs/langs/yaml';
import theme from '@shikijs/themes/dracula';
import { readFileSync } from 'node:fs';
import { createHighlighterCoreSync } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// @ts-expect-error Type definition incorrect
import { Remarkable, utils } from 'remarkable';

const shiki = createHighlighterCoreSync({
	themes: [theme],
	langs: [
		javascript,
		typescript,
		html,
		rust,
		bash,
		json,
		yaml,
		scss,
		css,
		sass,
		xml,
		tsx,
		markdown
	],
	engine: createJavaScriptRegexEngine()
});

// Remove frontmatter YAML - https://stackoverflow.com/a/33537453/5404186
const metadataRegex = /^---((.|\n)*?)---/g;

export const list = <T>({ path }: { path: 'portfolio' | 'blog' }): Promise<MarkdownData<T>[]> => {
	const promises: Promise<MarkdownData<T>>[] = listSlugs({ path }).map(({ slug }: Slug) =>
		get({ slug, path })
	);

	return Promise.all(promises);
};

export const get = async <T>({
	slug,
	path
}: {
	slug: string;
	path: 'portfolio' | 'blog';
}): Promise<MarkdownData<T>> => {
	const metadata: T = buildMetadata({ slug, path }) || ({} as T);
	const content = renderHTML({ slug, path });
	return { metadata, content, slug };
};

const buildMetadata = <T>({
	slug,
	path
}: {
	slug: string;
	path: 'portfolio' | 'blog';
}): T | undefined => {
	const content: string = readFile({ path, slug });

	const rawMetdata: string[] | undefined = metadataRegex
		.exec(content)?.[1]
		?.split('\n')
		?.filter((value: string) => value !== '');

	return rawMetdata?.reduce((acc: T, value: string) => {
		const [key, ...rest]: string[] = value.split(':');

		const obj: Record<string, string> = {};
		obj[key] = rest.join(':').replace(/"/g, '').trim();

		return { ...acc, ...obj };
	}, {} as T);
};

const renderHTML = ({ slug, path }: { slug: string; path: 'portfolio' | 'blog' }): string => {
	const md: Remarkable = new Remarkable({
		html: true,
		xhtmlOut: true,
		breaks: true
	});

	// @ts-expect-error We are fine without types.
	const codeRule = () => (tokens, idx, _options, _env) => {
		return shiki.codeToHtml(tokens[idx].content.trim(), {
			lang: tokens[idx].params ? tokens[idx].params : 'javascript',
			theme: 'dracula',
			colorReplacements: {
				'#282a36': '#000000'
			}
		});
	};

	md.renderer.rules.fence = codeRule();

	// @ts-expect-error We are fine without types.
	const linkOpenRule = () => (tokens, idx, options, _env) => {
		const title = tokens[idx].title
			? ' title="' + utils.escapeHtml(utils.replaceEntities(tokens[idx].title)) + '"'
			: '';
		const target = options.linkTarget ? ' target="' + options.linkTarget + '"' : '';
		return (
			'<a href="' +
			utils.escapeHtml(tokens[idx].href) +
			'"' +
			title +
			target +
			' rel="noopener noreferrer external">'
		);
	};

	md.renderer.rules.link_open = linkOpenRule();

	// @ts-expect-error We are fine without types.
	const imageRule = () => (tokens, idx, options, _env) => {
		const url = utils
			.escapeHtml(tokens[idx].src)
			.replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS);

		const src = ' src="' + url + '"';
		const title = tokens[idx].title
			? ' title="' + utils.escapeHtml(utils.replaceEntities(tokens[idx].title)) + '"'
			: '';
		const alt =
			' alt="' +
			(tokens[idx].alt
				? utils.escapeHtml(utils.replaceEntities(utils.unescapeMd(tokens[idx].alt)))
				: '') +
			'"';
		const suffix = options.xhtmlOut ? ' /' : '';
		return '<img' + src + alt + title + suffix + ' loading="lazy">';
	};

	md.renderer.rules.image = imageRule();

	const content: string = readFile({ path, slug });

	const cleanContent: string = content.replace(metadataRegex, '');

	return md.render(cleanContent);
};

const readFile = ({ slug, path }: { slug: string; path: 'portfolio' | 'blog' }): string => {
	const buffer = readFileSync(`src/${path}/${slug}.md`);
	return buffer.toString('utf-8');
};

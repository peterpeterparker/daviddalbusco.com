import type { PageData } from '$lib/core/types/page';
import type { SlugPath } from '$lib/core/types/slug';
import { assetUrl } from '$lib/core/utils/assets.utils';
import { listSlugs } from '$plugins/slug.plugin';
import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import dockerfile from '@shikijs/langs/dockerfile';
import html from '@shikijs/langs/html';
import javascript from '@shikijs/langs/javascript';
import json from '@shikijs/langs/json';
import markdown from '@shikijs/langs/markdown';
import rust from '@shikijs/langs/rust';
import sass from '@shikijs/langs/sass';
import scss from '@shikijs/langs/scss';
import toml from '@shikijs/langs/toml';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import xml from '@shikijs/langs/xml';
import yaml from '@shikijs/langs/yaml';
import theme from '@shikijs/themes/dracula';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
		markdown,
		toml,
		dockerfile
	],
	engine: createJavaScriptRegexEngine()
});

// Remove frontmatter YAML - https://stackoverflow.com/a/33537453/5404186
const metadataRegex = /^---((.|\n)*?)---/g;

export const list = <T>({
	path,
	subPath
}: {
	path: SlugPath;
	subPath?: string;
}): Promise<PageData<T>[]> => {
	const promises = listSlugs({ path, subPath }).map(({ name: slug, group }) =>
		get<T>({ slug, group, path })
	);

	return Promise.all(promises);
};

export interface GetPageData {
	path: SlugPath;
	slug: string;
	group?: string;
}

export const get = async <T>({ slug, group, ...rest }: GetPageData): Promise<PageData<T>> => {
	const metadata = buildMetadata<T>({ slug, group, ...rest }) || ({} as T);
	const content = renderHTML({ slug, group, ...rest });
	return { metadata, content, slug: { name: slug, group } };
};

const buildMetadata = <T>({ slug, group, path }: GetPageData): T | undefined => {
	const content = readFile({ path, slug, group });

	const rawMetdata = metadataRegex
		.exec(content)?.[1]
		?.split('\n')
		?.filter((value: string) => value !== '');

	const toValue = (rest: string[]): string => rest.join(':').replace(/"/g, '').trim();

	const basicMetadata = rawMetdata?.reduce<Partial<T>>((acc, value) => {
		const [key, ...rest] = value.split(':');

		const obj: Record<string, string> = {};
		obj[key] = toValue(rest);

		return { ...acc, ...obj };
	}, {});

	const arrayMetadata: Record<string, string[]> = {};
	let arrayKey: string | undefined;

	for (const line of rawMetdata ?? []) {
		const [key, ...rest] = line.split(':');

		if (toValue(rest) === '') {
			arrayKey = key;
		} else if (arrayKey !== undefined) {
			const arrayItemMatch = line.match(/^\s*-\s*(.+)$/);

			if (arrayItemMatch !== null) {
				arrayMetadata[arrayKey] = [
					...(arrayMetadata[arrayKey] ?? []),
					toValue([arrayItemMatch[1]])
				];
			}
		}
	}

	// Optimistically typed. irl I would use e.g. Zod here.
	return {
		...basicMetadata,
		...arrayMetadata
	} as T;
};

const renderHTML = ({ slug, path, group }: GetPageData): string => {
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
		const url = assetUrl(utils.escapeHtml(tokens[idx].src));

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

	const content = readFile({ path, group, slug });

	const cleanContent = content.replace(metadataRegex, '');

	return md.render(cleanContent);
};

const readFile = ({ slug, path, group }: GetPageData): string => {
	const filePath = join('src', path, group ?? '', `${slug}.md`);
	const buffer = readFileSync(filePath);
	return buffer.toString('utf-8');
};

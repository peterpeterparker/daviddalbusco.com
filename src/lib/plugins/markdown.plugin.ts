import {listSlugs} from '$lib/plugins/slug.plugin';
import type {MarkdownData} from '$lib/types/markdown';
import type {Slug} from '$lib/types/slug';
import {readFileSync} from 'fs';
import {Remarkable, utils} from 'remarkable';

// Remove frontmatter YAML - https://stackoverflow.com/a/33537453/5404186
const metadataRegex = /^---((.|\n)*?)---/g;

export const list = <T>({path}: {path: 'portfolio' | 'blog'}): Promise<MarkdownData<T>[]> => {
  const promises: Promise<MarkdownData<T>>[] = listSlugs({path}).map(({slug}: Slug) => get({slug, path}));

  return Promise.all(promises);
};

export const get = async <T>({slug, path}: {slug: string; path: 'portfolio' | 'blog'}): Promise<MarkdownData<T>> => {
  const metadata: T = buildMetadata({slug, path}) || ({} as T);
  const content = renderHTML({slug, path});
  return {metadata, content, slug};
};

const buildMetadata = <T>({slug, path}: {slug: string; path: 'portfolio' | 'blog'}): T | undefined => {
  const content: string = readFile({path, slug});

  const rawMetdata: string[] | undefined = metadataRegex
    .exec(content)?.[1]
    ?.split('\n')
    ?.filter((value: string) => value !== '');

  return rawMetdata?.reduce((acc: T, value: string) => {
    const [key, ...rest]: string[] = value.split(':');

    const obj: Record<string, string> = {};
    obj[key] = rest.join(':').replace(/"/g, '').trim();

    return {...acc, ...obj};
  }, {} as T);
};

const renderHTML = ({slug, path}: {slug: string; path: 'portfolio' | 'blog'}): string => {
  const md: Remarkable = new Remarkable({
    html: true,
    xhtmlOut: true,
    breaks: true
  });

  const codeRule = () => (tokens, idx, _options, _env) => {
    return `<deckgo-highlight-code 
                language="${tokens[idx].params ? tokens[idx].params : 'javascript'}">
                    <code slot="code">${utils.escapeHtml(tokens[idx].content)}</code>
            </deckgo-highlight-code>`;
  };

  md.renderer.rules.fence = codeRule();

  const linkOpenRule = () => (tokens, idx, options, _env) => {
    const title = tokens[idx].title
      ? ' title="' + utils.escapeHtml(utils.replaceEntities(tokens[idx].title)) + '"'
      : '';
    const target = options.linkTarget ? ' target="' + options.linkTarget + '"' : '';
    return (
      '<a href="' + utils.escapeHtml(tokens[idx].href) + '"' + title + target + ' rel="noopener noreferrer external">'
    );
  };

  md.renderer.rules.link_open = linkOpenRule();

  const imageRule = () => (tokens, idx, options, _env) => {
    const src = ' src="' + utils.escapeHtml(tokens[idx].src) + '"';
    const title = tokens[idx].title
      ? ' title="' + utils.escapeHtml(utils.replaceEntities(tokens[idx].title)) + '"'
      : '';
    const alt =
      ' alt="' +
      (tokens[idx].alt ? utils.escapeHtml(utils.replaceEntities(utils.unescapeMd(tokens[idx].alt))) : '') +
      '"';
    const suffix = options.xhtmlOut ? ' /' : '';
    return '<img' + src + alt + title + suffix + ' loading="lazy">';
  };

  md.renderer.rules.image = imageRule();

  const content: string = readFile({path, slug});

  const cleanContent: string = content.replace(metadataRegex, '');

  return md.render(cleanContent);
};

const readFile = ({slug, path}: {slug: string; path: 'portfolio' | 'blog'}): string => {
  const buffer = readFileSync(`src/${path}/${slug}.md`);
  return buffer.toString('utf-8');
};

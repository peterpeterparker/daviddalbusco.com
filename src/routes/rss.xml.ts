import {listBlog} from '$lib/plugins/blog.plugin';
import type {BlogMetadata} from '$lib/types/blog';
import type {MarkdownData} from '$lib/types/markdown';
import type {ResponseBody} from '@sveltejs/kit';

const url = 'https://daviddalbusco.com/';

// Even though there is not max-length for content in RSS 2.0, we limit the length and add three dots
const contentMaxLength = 500;

export const GET = async (): Promise<ResponseBody> => {
  const headers: Record<string, string> = {
    'Cache-Control': 'max-age=3600',
    'Content-Type': 'application/xml'
  };

  const posts: MarkdownData<BlogMetadata>[] = await listBlog();

  // We do not know here whe the site was built but, we can know when last blog post was published
  const lastBuildDate: string = new Date(posts[0].metadata.date).toUTCString();

  return {
    headers,
    body: `<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
        <channel>
            <title><![CDATA[David Dal Busco RSS Feed]]></title>
            <description><![CDATA[Freelance Web Developer - Web, Progressive Web Apps and Mobile]]></description>
            <link>${url}</link>
            <lastBuildDate>${lastBuildDate}</lastBuildDate>
            
            ${(await blog({posts})).join('')}
        </channel>
    </rss>`
  };
};

const blog = async ({posts}: {posts: MarkdownData<BlogMetadata>[]}): Promise<string[]> => {
  return posts.map(({metadata, slug, content}: MarkdownData<BlogMetadata>) => {
    const {title, description, date} = metadata;

    const escapedContent: string = escapeXml(content);

    return `
        <item>
          <title><![CDATA[${title}]]></title>
          <description><![CDATA[${description}]]></description>
          <link>${url}blog/${slug}/</link>
          <pubDate>${new Date(date).toUTCString()}</pubDate>
          <content:encoded>${
            escapedContent.length > contentMaxLength
              ? `${escapedContent.slice(0, contentMaxLength)}...`
              : escapedContent
          }</content:encoded>
        </item>
      `;
  });
};

// https://stackoverflow.com/a/27979933/5404186
const escapeXml = (html: string): string => {
  return html.replace(/[<>&'"]/g, function (c: string) {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
};

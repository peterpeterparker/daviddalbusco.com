import { listBlog } from '$lib/plugins/blog.plugin';
import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';

export const prerender = true;

const url = 'https://daviddalbusco.com/';

export const GET = async (): Promise<Response> => {
	const headers: Record<string, string> = {
		'Cache-Control': 'max-age=3600',
		'Content-Type': 'application/xml'
	};

	const posts = await listBlog();

	// We do not know here whe the site was built but, we can know when last blog post was published
	const lastBuildDate = new Date(posts[0].metadata.date).toUTCString();

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
        <channel>
            <title><![CDATA[David Dal Busco RSS Feed]]></title>
            <description><![CDATA[Freelance Web Engineer]]></description>
            <link>${url}</link>
            <lastBuildDate>${lastBuildDate}</lastBuildDate>
            
            ${(await blog({ posts })).join('')}
        </channel>
    </rss>`,
		{ headers: headers }
	);
};

const blog = async ({ posts }: { posts: MarkdownData<BlogMetadata>[] }): Promise<string[]> => {
	return posts.map(({ metadata, slug, content }: MarkdownData<BlogMetadata>) => {
		const { title, description, date } = metadata;

		return `
        <item>
          <title><![CDATA[${title}]]></title>
          <description><![CDATA[${description}]]></description>
          <link>${url}blog/${slug}/</link>
          <pubDate>${new Date(date).toUTCString()}</pubDate>
          <content:encoded><![CDATA[${content}]]></content:encoded>
        </item>
      `;
	});
};

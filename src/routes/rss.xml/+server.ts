import type { Trail } from '$lib/trails/types/trail';
import type { BlogMetadata } from '$lib/types/blog';
import type { PageData } from '$lib/types/page';
import { listBlog } from '$plugins/blog.plugin';
import { listTrails } from '$plugins/trails.plugin';

export const prerender = true;

const url = 'https://daviddalbusco.com/';

export const GET = async (): Promise<Response> => {
	const headers: Record<string, string> = {
		'Cache-Control': 'max-age=3600',
		'Content-Type': 'application/xml'
	};

	const [posts, trailsList] = await Promise.all([listBlog(), listTrails()]);

	type Item =
		| { type: 'post'; date: Date; item: PageData<BlogMetadata> }
		| { type: 'trail'; date: Date; item: PageData<Trail> };

	const items: Item[] = [
		...posts.map((post) => ({
			type: 'post' as const,
			date: new Date(post.metadata.date),
			item: post
		})),
		...trailsList.map((trail) => ({
			type: 'trail' as const,
			date: new Date(trail.metadata.metadata.date),
			item: trail
		}))
	].sort(({ date: dateA }, { date: dateB }) => {
		return dateB.getTime() - dateA.getTime();
	});

	// We do not know here whe the site was built but, we can know when last blog post was published
	const lastBuildDate = items[0].date.toUTCString();

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
        <channel>
            <title><![CDATA[David Dal Busco RSS Feed]]></title>
            <description><![CDATA[Freelance Software Engineer]]></description>
            <link>${url}</link>
            <lastBuildDate>${lastBuildDate}</lastBuildDate>
            
            ${items.map((item) => (item.type === 'post' ? post({ post: item.item }) : trail({ trail: item.item }))).join('')}
        </channel>
    </rss>`,
		{ headers: headers }
	);
};

const post = ({ post: { metadata, slug, content } }: { post: PageData<BlogMetadata> }): string => {
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
};

const trail = ({ trail: { metadata, slug, content } }: { trail: PageData<Trail> }): string => {
	const {
		metadata: { title, date }
	} = metadata;

	return `
        <item>
          <title><![CDATA[${title}]]></title>
          <link>${url}trails/${slug}/</link>
          <pubDate>${new Date(date).toUTCString()}</pubDate>
          <content:encoded><![CDATA[${content}]]></content:encoded>
        </item>
      `;
};

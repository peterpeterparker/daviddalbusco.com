---
path: "/blog/prepare-your-dapps-for-social-platforms-and-seo"
date: "2022-09-29"
title: "Prepare your dapps for social platform and SEO"
description: "A guide to set up dapps metadata, icons and social image for social media sites and search engines."
tags: "#social #seo #programming #web"
image: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw0Nnx8YWJzdHJhY3R8ZW58MHx8fHwxNjY0NDI4NDU5&ixlib=rb-1.2.1&q=80&w=1080"
canonical: "https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/d/prepare-your-dapps-for-social-platform-and-seo"
---

![Minimalistic 3D Rendering Wallpaper in 8K Resolution.](https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkyMzV8MHwxfHNlYXJjaHw0Nnx8YWJzdHJhY3R8ZW58MHx8fHwxNjY0NDI4NDU5&ixlib=rb-1.2.1&q=80&w=1080)

*[Sebastian Svenson](https://unsplash.com/@sebastiansvenson)*

Now that the [Internet Computer](https://internetcomputer.org/) finally supports crawlers, dapps running 100% on chain can be indexed by search engine and their metadata can be read to generate card on social platform.

This is the list of things I do to prepare my web applications for social media sites and SEO so that you can do too.

*Note that I am no SEO expert. Following tips are not related to ranking but to the way the information are extracted for presentation purpose.*

* * *

## Introduction

To configure the bare minimum meta data for a project, we need following information to get started:

*   Title: the name of the application, the product.
*   Description: its tag line, its catchy selling phrase.
*   Icon: a square image used to generate the favicons (note the plural).
*   Social image: another image (ratio 1.9:1) used to generate a card on platforms such as Twitter, Facebook, Discord, LinkedIn etc.

* * *

## Meta tags

Search engines use the content they crawl for indexation, ranking and rendering purpose but, my understanding, still consider the meta tags available in the `HTML` for search indexation too.

Likewise, crawlers of social platform look for meta tags to generate the social media content displayed for any link that is shared.

That is why, we have to provide a variety of meta tags and images for our dapps.

* * *

### HTML tags

The most obvious set of information we can define is probably the HTML elements in the `<head />` container of our HTML pages.

We can - or should - set a `<title />` but also a `<description />`. Sometimes I also provide an `<author />`.

Two others things that should really not be forgotten:

1.  It is important to set a language to the document that matches its content. Not absolutely related to this tutorial but if you provide e.g. meta tags in Spanish, it is useful to also set the document as such.
2.  If your content is redundant on the web - e.g. blogging on multiple platforms - or if you want to indicate that multiple pages are actually related, it is important to provide `canonical` links to inform search engine that they should not index multiple times the same content. Otherwise, it can lead to a downgrade of the ranking note (my understanding).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    
    <title>Papyrs</title>
    <meta content="Blog on web3" name="description" />

    <link href="https://papy.rs" rel="canonical" />
  </head>
</html>
```

Resources:

*   [https://www.w3schools.com/html/html\_head.asp](https://www.w3schools.com/html/html_head.asp)
*   [https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

* * *

## og: tags

Open Graph meta tags - or `og:` - are snippets of code that control how our applications are displayed when shared on social platform.

i.e. the tags control what will be displayed when our URLs are shared on platform such as Facebook, LinkedIn, Discord, etc.

There are lots of these different tags but, commonly I use only the following five in my sites and applications:

1.  `og:title`: the title of the app or in case of multiple pages, a title related to the page's content - e.g. in case of a blog, the particular title of a post.
2.  `og:description`: same as title but for the description.
3.  `og:url`: the URL of the content. To consolidate connected data, I also apply here the same approach as for the `canonical` URLs.
4.  `og:type`: commonly `website` for a page or `article` in case of a blog post.
5.  `og:image`: an absolute URL to the social image (see chapter here under for more information about its format).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Here same HTML tags as previous chapter -->

    <meta content="Papyrs" property="og:title" />
    <meta content="Blog on web3" property="og:description" />
    <meta content="website" property="og:type" />
    <meta content="https://papy.rs" property="og:url" />
    <meta content="https://papy.rs/images/social-image.jpg" property="og:image" />
  </head>
</html>
```

Resources:

*   [https://ogp.me/](https://ogp.me/)

![capture-d%E2%80%99e%CC%81cran-2022-09-29-a%CC%80-12.01.15.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-09-29-a%CC%80-12.01.15.png?token=zmeCyAslDbC4Yc5k8Hqlo)

*Sharing https://papy.rs on LinkedIn*



* * *

### twitter: tags

While Open Graph tags are interpreted as well (I think), Twitter has its own set of meta tags. That is why it is best to also provide these to control how our applications are displayed when shared on this particular platform.

There are various possibilities of display, I generally set following property to render the "summary cards":

1.  `twitter:card`: the type of card - of tweet. I like to use `summary_large_image` because it fits best the size of the social images I provide.
2.  `twitter:title`: the title of the product or page.
3.  `twitter:description`: the catchy phrase.
4.  `twitter:image`: the absolute URL to the social image.
5.  `twitter:creator`: the Twitter handle of the product or its creator.

It is worth to remember that a tweet limit is 280 characters which apply to the information we provide.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Here same HTML tags as previous chapter -->
    <!-- Here same og: tags as previous chapter -->

    <meta content="summary_large_image" name="twitter:card" />
    <meta content="Papyrs" name="twitter:title" />
    <meta content="Blog on web3" name="twitter:description" />
    <meta content="https://papy.rs/images/social-image.jpg" name="twitter:image" />
    <meta content="@PapyrsApp" name="twitter:creator" />
  </head>
</html>
```

Resources:

*   [https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image)

![capture-d%E2%80%99e%CC%81cran-2022-09-29-a%CC%80-12.03.37.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-09-29-a%CC%80-12.03.37.png?token=AoqEPYOZe9maYX2R_W39X)

*Sharing https://papy.rs on Twitter*



* * *

## Social image

Providing the social image is governed by one single rule: it should be provided with an absolute URL - i.e. it should not be provided with an absolute path. It would not be interpreted correctly by crawlers.

```html
<!-- This works -->
<meta content="https://papy.rs/images/social-image.jpg" name="twitter:image" />

<!-- This does NOT work -->
<meta content="/images/social-image.jpg" name="twitter:image" />
```

Regarding format and content and as a best practice, I advise to create an image of `1200x628` pixels for optimal dimension across all devices and to use an old fashioned image format such as `png` or `jpg`.

Speaking of, it will be displayed on small and large screen - i.e. there is only one single image for all screens. Therefore, when designing it, it is also worth to remember to compose its content so that it fits best anywhere.

* * *

## Favicons

Favicons aren't just the good old `favicon.ico` we used to set at the root of our website back in the good old days (😉). Sure, we should still provide one favorite icon for the browser but, we also  have to think on various devices. Vendors have added various ways of defining icons that will be use when our applications and sites get added to the device' home screen.

In addition, there are also some new meta tags that we can set to specify other capabilities. e.g. defining the theme color that will be applied around the browser URL bar on mobile devices.

To generate these data I proceed as following:

1.  I design an icon which I export to `png` or `jpg` in a square format - e.g. `1080x1080` pixels.
2.  I head up to [https://realfavicongenerator.net/](https://realfavicongenerator.net/) and I use this tool to generate a set of data for favicons and theming information.
3.  While I could stop here, since above tool already generates all data needed, I like to overrule those icons it generated to provide more flavors - my own icons. That's why I export various dimension of my icons (`48x48`, `72x72`, `96x96`, `144x144`, `192x192`, `256x256`, `384x384` and `512x512` pixels).
4.  I copy my icons and the generated data to the static assets of my applications.
5.  Finally, I set the related meta tags to my HTML pages.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Here same HTML tags as previous chapter -->
    <!-- Here same og: tags as previous chapter -->
    <!-- Here same twitter: tags as previous chapter -->

    <link href="/favicon-32x32.png" rel="icon" type="image/png" />
    <meta content="#000000" name="theme-color" />

    <link href="/icons/icon-48x48.png" rel="apple-touch-icon" sizes="48x48" />
    <link href="/icons/icon-72x72.png" rel="apple-touch-icon" sizes="72x72" />
    <link href="/icons/icon-96x96.png" rel="apple-touch-icon" sizes="96x96" />
    <link href="/icons/icon-144x144.png" rel="apple-touch-icon" sizes="144x144" />
    <link href="/icons/icon-192x192.png" rel="apple-touch-icon" sizes="192x192" />
    <link href="/icons/icon-256x256.png" rel="apple-touch-icon" sizes="256x256" />
    <link href="/icons/icon-384x384.png" rel="apple-touch-icon" sizes="384x384" />
    <link href="/icons/icon-512x512.png" rel="apple-touch-icon" sizes="512x512" />

    <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#7888ff" />
    <meta name="msapplication-TileColor" content="#ffeed6" />
    <meta name="msapplication-config" content="/icons/browserconfig.xml" />
  </head>
</html>
```

Resources:

*   [https://realfavicongenerator.net/](https://realfavicongenerator.net/)

![capture-d%E2%80%99e%CC%81cran-2022-09-29-a%CC%80-12.10.11.png](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/capture-d%E2%80%99e%CC%81cran-2022-09-29-a%CC%80-12.10.11.png?token=ZDNI5SzJk2WsjoE9z9gDD)

*A favicon displayed in the tab by Firefox*



* * *

### Maskable icons

While above does the job for most devices, for Android devices it is best to use adaptive icons - also know as "maskable icons" - as well. They display app icons in a variety of shapes across different device models.

I generally create another icon which I shape with the help of [https://maskable.app/editor](https://maskable.app/editor) to fits best any devices and which I also export in all various dimension I listed in previous chapter.

Resources:

*   [https://web.dev/maskable-icon/](https://web.dev/maskable-icon/)
*   [https://maskable.app/editor](https://maskable.app/editor)

![maskable-animation.gif](https://6zvwc-sqaaa-aaaal-aalma-cai.raw.ic0.app/images/maskable-animation.gif?token=Np_L4Zk4hIMEYArteyU00)



* * *

## Web app manifest

The web app manifest is a JSON file that tells the browser about our web application and how it should behave when installed on the user's desktop or mobile device.

It should be provided by our smart contract with the appropriate JSON mime type (`application/json`).

Commonly named `manifest.webmanifest` or `manifest.json` and served from the root of our websites, these files contain the same meta information as those we specified previously but, can also provide much more - e.g. shortcuts and screenshots.

Even if provided on a top-level directory, it should be referenced in the HTML pages.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Here same HTML tags as previous chapter -->
    <!-- Here same og: tags as previous chapter -->
    <!-- Here same twitter: tags as previous chapter -->
    <!-- Here same favicons and other info as previous chapter -->

    <link crossorigin="anonymous" href="/manifest.webmanifest" rel="manifest" />
  </head>
</html>
```

The tool I listed previously - Favicon Generator - provides a bare minimal web app manifest which I enhance with my custom icons.

```json
{
  "name": "Papyrs",
  "short_name": "Papyrs",
  "start_url": "/",
  "background_color": "#000000",
  "theme_color": "#000000",
  "display": "standalone",
  "icons": [
    {"src": "icons/icon-48x48.png", "sizes": "48x48", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-72x72.png", "sizes": "72x72", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-96x96.png", "sizes": "96x96", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-144x144.png", "sizes": "144x144", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-256x256.png", "sizes": "256x256", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-384x384.png", "sizes": "384x384", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
    {
      "src": "icons/maskable-48x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-256x256.png",
      "sizes": "256x256",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}

```

Resources:

*   [https://web.dev/add-manifest/](https://web.dev/add-manifest/)
*   [https://developer.mozilla.org/en-US/docs/Web/Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

* * *

## Sitemap.xml

Sitemaps are useful to help search engines understand what pages should be crawled and indexed. While I am guessing it is not that useful in case of single page application, I like to provide the information anyway.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
    <url>
    <loc>https://papy.rs/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    </url>
    
</urlset>
```

The `sitemap.xml` is an XML file, therefore it should be served by our canister with the appropriate mime type (`application/xml`). It should also be referenced within our HTML pages.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Here same HTML tags as previous chapter -->
    <!-- Here same og: tags as previous chapter -->
    <!-- Here same twitter: tags as previous chapter -->
    <!-- Here same favicons and other info as previous chapter -->
    <!-- Here link to web app manifest -->

    <link href="/sitemap.xml" rel="sitemap" type="application/xml" />
  </head>
</html>
```

Resources:

*   [https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

* * *

Robots.txt

At this point we set up everything we need for search engine and social platform but, crawlers might not yet be able to read these information. That is why we need to add a `robots.txt` file at the root of our site to control how they should access our content.

Assuming we want any crawlers to index our all app, we can provide such information by targeting all `User-agent: \*` and allowing everything `Allow: /`.

We can also provide again the URL to our sitemap and host information.

```html
User-agent: *
Allow: /
Sitemap: https://papy.rs/sitemap.xml
Host: https://papy.rs
```

Resources:

*   [https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt](https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt)

* * *

## Summary

To prepare our dapps for social media sites and SEO we need:

1.  a title
2.  a description or a catchy selling purpose
3.  icons
4.  a social image

These static assets need to be served by our canister smart contracts and we have to set meta data in:

*   all HTML pages of our application
*   a web app manifest
*   a sitemap.xml

And we should not forget to allow crawlers to view our content by defining a robots.txt.

To infinity and beyond  
David
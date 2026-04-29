---
path: "/blog/making-your-website-ai-ready"
date: "2026-06-01"
title: Making Your Website AI-Ready
description: "What I implemented on my site to make it discoverable and useful for AI agents — llms.txt, skills, and agent readiness signals."
tags: "#ai #llms #skills #webdev #sveltekit #javascript"
image: "https://daviddalbusco.com/assets/images/logan-voss-1QlMVjKbJrY-unsplash.jpg"
---

I've been gradually making the documentation of my hobby project, [Juno](https://juno.build), more AI-friendly. Not in a buzzword-chasing sense, but because I noticed that tools like Claude, ChatGPT, and AI-powered search engines increasingly try to read websites directly. And when they do, they often land on HTML which I assume, is suboptimal.

So I spent some time implementing a few things that make the docs cleaner and more useful for their agents while trying to find my way in the variety of specifications because it seems we live in a time where every major corporation just goes "yolo here are our standards". So, here's what I did, hoping it might help you too.

---

## llms.txt

The starting point is [llmstxt.org](https://llmstxt.org/), a proposal by Jeremy Howard that defines a `/llms.txt` file living at the root of your site. Think of it like `sitemap.xml`, but for AI tools rather than search crawlers: a structured Markdown document that gives agents a curated entry point to understand your site, what it is, what it covers, and where to find the important pages.

```txt
# Juno
 
> Juno is a full-stack platform to develop, deploy, and run apps in WASM containers with zero DevOps.
 
## Docs
 
- [Getting started](https://juno.build/docs/intro.md): Introduction and quick start
- [CLI reference](https://juno.build/docs/cli.md): All CLI commands
 
## Build
 
- [Functions](https://juno.build/docs/build/functions.md): Learn how to develop Serverless Functions
```

> While the link descriptions are marked as optional in the spec, in practice I found that omitting them noticeably degraded the output of the tools I used to test my files.

### llms-full.txt

You can (even should, probably) also generate a companion `llms-full.txt` that expands all those links into a single document with the full content, handy when you want to give an AI everything at once rather than making it follow links.

Relatively simple so far. But we didn't stop there.

### Markdown versions of each page

The spec also suggests providing a clean Markdown version of every page at the same URL with `.md` appended. So `/blog/my-post` (respectively `/blog/my-post/index.html` or `/blog/my-post.html`) would have a Markdown twin at `/blog/my-post.md`.

This is useful beyond the spec itself. When an AI agent fetches a page and gets back clean prose instead of HTML, it has a much better time extracting the actual content.

### Alternate rel meta tags

While I did not find it in the spec, I noticed other sites were also adding a `<link rel="alternate" type="text/markdown" href="/blog/my-post.md" />` tag to the `<head>` of each page. It's a signal agents can pick up when they land on the HTML version: there is a cleaner format available.

### Generating the files

No one is going to maintain those files by hand, right? The common approach is to use an existing plugin for your documentation framework that takes care of generating them on each build.

In my case, I ended up writing my own Docusaurus plugin. Firstly because I always pay attention to tech debt, preferring doing it myself when the ratio effort/costs feels better on the long term and, it gave me the flexibility to control the output with the fine grain I wanted. For example, I decided not to include blog posts in `llms.txt` since they would duplicate snippets already covered by the documentation. Whether that actually matters to an AI is anyone's guess, but it felt cleaner.

Since the files are generated at build time, I also set up a GitHub Action that commits a snapshot of them to the repo on each run. That way, on every PR, I can visually check whether the changes were applied as expected.

- [Docusaurus plugin](https://github.com/junobuild/docs/blob/main/plugins/docusaurus.llms.plugin.ts)
- [GitHub Action](https://github.com/junobuild/docs/blob/main/.github/workflows/llms.yml)

### Link header pointing to llms.txt

Last on this topic, in the HTTP response headers of the root page:

```
Link: </llms.txt>; rel="describedby"
```

A few crawlers and tools already know to look for this, as I learned by using an assertion tool I'll share below in the last chapter.
 








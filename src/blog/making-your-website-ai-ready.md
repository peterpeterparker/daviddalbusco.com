---
path: "/blog/making-your-website-ai-ready"
date: "2026-06-18"
title: Making Your Website AI-Ready
description: "A few tips to help your site become LLM-friendly (or not)."
tags: "#ai #llms #skills #webdev"
image: "https://daviddalbusco.com/images/blog/maxim-berg-qsDfqZyTCAE-unsplash.jpg"
standard_site: "at://did:plc:fxmgj7lnas3ewnc3hmpx2vg6/site.standard.document/3mokjqz7v3w2z"
---

![](https://daviddalbusco.com/images/blog/maxim-berg-qsDfqZyTCAE-unsplash.jpg)

> Photo by [Maxim Berg](https://unsplash.com/fr/@maxberg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/un-fond-multicolore-avec-des-lignes-de-differentes-couleurs-qsDfqZyTCAE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I've been gradually trying to make my project, [Juno](https://juno.build), more AI-friendly. One might argue I failed since it's now deprecated (#yolo), but since I navigated a whole bunch of various pseudo-standard specifications (spoiler alert: every major corporation just goes "here are our standards"), I figured I'd share what I found, hoping it might help you too.

---

## llms.txt

The starting point is [llmstxt.org](https://llmstxt.org/), a proposal by Jeremy Howard that defines a `/llms.txt` file living at the root of your site. Think of it like `sitemap.xml`, but for AI tools rather than search crawlers: a structured Markdown document that gives agents a curated entry point to your site.

That said, it's worth noting that it recently started to be challenged. Astro notably removed it, arguing they didn't notice much traffic requesting those files (see PR [#13538](https://github.com/withastro/docs/pull/13538)). So I'm not really sure if LLMs are still considering it nowadays.

```txt
# Juno

> Juno is a full-stack platform to develop, deploy, and run apps in WASM containers with zero DevOps.

## Docs

- [Getting started](https://juno.build/docs/intro.md): Introduction and quick start
- [CLI reference](https://juno.build/docs/cli.md): All CLI commands

## Build

- [Functions](https://juno.build/docs/build/functions.md): Learn how to develop Serverless Functions
```

> While the link descriptions are marked as optional in the spec, in practice I found that omitting them degraded the output of the tools I used to test my files.

### llms-full.txt

When implementing this standard, you can (or should, probably) also generate a companion `llms-full.txt` that expands all those links into a single document with the full content, handy when you want to give an AI everything at once rather than making it follow links.

### Markdown versions of each page

The spec also suggests providing a clean Markdown version of every page at the same URL with `.md` appended. So `/blog/my-post` (respectively `/blog/my-post/index.html` or `/blog/my-post.html`) would have a Markdown twin at `/blog/my-post.md`.

This is useful beyond the spec itself. When an AI agent fetches a page and gets back clean prose instead of HTML, it has a much better time extracting the actual content.

### Alternate rel meta tags

While I did not find it in the spec, I noticed other sites were also adding a `<link rel="alternate" type="text/markdown" href="/blog/my-post.md" />` tag to the `<head>` of each page. It's a signal agents can pick up when they land on the HTML version: there is a cleaner format available.

### Generating the files

No one is going to maintain those files by hand, right? The common approach is to use an existing plugin for your documentation framework that takes care of generating them on each build.

In my case, I ended up writing my own Docusaurus plugin, because I always pay attention to tech debt, preferring to do it myself when the effort/cost ratio makes sense long term, and it gave me the flexibility to control the output with the fine grain I wanted. For example, I decided not to include blog posts in `llms.txt` since they would duplicate snippets already covered by the documentation. Whether that actually matters to an AI is anyone's guess, but it felt cleaner.

Since the files are generated at build time, I also set up a GitHub Action that commits a snapshot of them to the repo on each run. That way, on every PR, I can visually check whether the changes were applied as expected.

- [Docusaurus plugin](https://github.com/junobuild/docs/blob/main/plugins/docusaurus.llms.plugin.ts)
- [GitHub Action](https://github.com/junobuild/docs/blob/main/.github/workflows/llms.yml)

### Link header pointing to llms.txt

Last on this topic, in the HTTP response headers of the root page:

```
Link: </llms.txt>; rel="describedby"
```

A few crawlers and tools already know to look for this, as I learned by using an assertion tool I'll share below in the last chapter.

### Summary

In short, this is what you need for a `llms.txt` setup.

| What                                 | Description                                |
| ------------------------------------ | ------------------------------------------ |
| `/llms.txt`                          | Curated entry point for AI agents          |
| `/llms-full.txt`                     | Full content expanded in a single document |
| `/your-page.md`                      | Clean prose version of each page           |
| `<link rel="alternate">` in `<head>` | Signals a Markdown version is available    |
| `Link` header on root page           | Points crawlers to your `llms.txt`         |

---

## Agent Readiness

While I discovered llms.txt last year, more recently I stumbled upon [Is It Agent Ready?](https://isitagentready.com), a tool by Cloudflare that scans your site against a growing list of standards. So, it's worth running it to see where you stand.

This platform gives you both results and guidance on how to fix things, so I won't repeat all that here, but here's what I ended up implementing based on its suggestions.

### robots.txt content signals

Beyond the usual `User-agent: *` rules, there is now a convention for signaling how you want your content treated by AI crawlers. It's a Cloudflare initiative called [Content Signals](https://contentsignals.org):

```txt
User-agent: *
Allow: /

Content-Signal: ai-train=no, search=yes, ai-input=yes
```

The three values are straightforward:

- `search`: your content can be indexed and shown in search results
- `ai-input`: your content can be used as real-time input to AI models, for example when an AI fetches your page to answer a question
- `ai-train`: your content can be used to train or fine-tune AI models

It's not enforced, but it's a signal. Whether you want to allow training, block it, or say nothing is your call. Being explicit is better than silence.

And fun fact, for this website I actually set `ai-input` to `no` 😉.

### API catalog in .well-known

`/.well-known/api-catalog` is an [IETF standard (RFC 9727)](https://datatracker.ietf.org/doc/rfc9727/) for automated discovery of the APIs a publisher exposes. In Juno's case, there is no public REST API to list, but the format supports linking to service documentation, which I used to point to the AI guide:

```json
{
	"linkset": [
		{
			"anchor": "https://juno.build",
			"service-doc": [{ "href": "https://juno.build/docs/guides/ai" }]
		}
	]
}
```

I also added a `Link` response header on the root page pointing to it:

```
Link: </.well-known/api-catalog>; rel="api-catalog"
```

The file needs to be served with `Content-Type: application/linkset+json`. How you set that depends on your hosting setup.

---

## Skills

[Agent Skills](https://agentskills.io) is another standard, originally created and introduced by Anthropic and since adopted by other platforms like OpenAI, Google Gemini, and GitHub Copilot.

This one is more niche though: you only need it if you have a product or library that developers might build with. If it's just a personal site or blog, you can skip this section.

### Creating your skill

A skill is a folder containing a `SKILL.md` file with instructions, scripts, and resources that an AI agent can load dynamically to perform a specific task reliably and repeatedly - think of it as packaged know-how for agents which you typically share as a standalone GitHub repo or subfolder of your project.

For Juno, I created one covering how to develop using its features, SDK, CLI, and how to interact with the platform. You can find it in the [junobuild/skills](https://github.com/junobuild/skills) repository.

### Linking your site

Once you have the files, you expose them at `.well-known/agent-skills/index.json` so agents visiting your site can discover them directly.

```json
{
	"$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
	"skills": [
		{
			"name": "juno",
			"type": "skill-md",
			"description": "Up-to-date knowledge about Juno's CLI, SDK, and serverless functions for AI coding agents.",
			"url": "https://raw.githubusercontent.com/junobuild/skills/main/SKILL.md",
			"digest": "sha256:18b7fec3e46664b67bdf5bd66f4f36fd9fca138a8749ddc2638f61fed4c23483"
		}
	]
}
```

As you can see, it defines the type and URL of the skill but also includes a digest of the `SKILL.md` file. What I did is recompute the hash on every build through a script and update the file automatically. I also set up a GitHub Action that runs the job once a week and on any PR to the documentation, so it should always stay up-to-date.

- [Script](https://github.com/junobuild/docs/blob/main/scripts/ai.mjs)
- [GitHub Action](https://github.com/junobuild/docs/blob/main/.github/workflows/update-ai.yml)

### Installation and discoverability

You should also register them on [skills.sh](https://skills.sh), a directory created by Vercel for broader discoverability. It also comes with a CLI that makes it easy for anyone to install your skills locally for any AI tool.

```bash
npx skills add junobuild/skills
```

---

## Conclusion

None of this is a silver bullet and you should definitely not just trust me bro. That said, most of it is low-effort to implement once you know these wild wild west conventions exist. It might make your site more useful for LLMs.

Until next time!
David

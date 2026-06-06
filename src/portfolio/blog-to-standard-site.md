---
title: "Blog to Standard.Site"
description: "A GitHub Action that automates the creation of AT Protocol records for blog posts."
type: "play"
status: "active"
order: "4"
---

# Blog to Standard.Site

Standard.Site is an AT Protocol schema for publishing websites and blog posts, enabling rich preview cards on Bluesky and other Atmosphere-powered platforms.

I built this action after it started gaining traction on Bluesky. Instead of manually creating the decentralized records for each new blog post, I automated the whole thing.

When I merge a pull request adding a new blog post on this website, the action detects the new file, creates a `site.standard.document` record on the AT Protocol network, and opens a pull request to update the post's frontmatter with the record URI. Once merged, the blog post renders a `<link rel="site.standard.document">` tag, enabling the Standard.Site preview card on Bluesky.

---

## Fact sheet

**Technology:** [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh), [Docker](https://www.docker.com/) and [GitHub Actions](https://github.com/features/actions)

**Platforms:** [Bluesky](https://bsky.app) and [AT Protocol](https://atproto.com)

---

## Open source

This project is open source and available on GitHub: [blog-to-standard-site](https://github.com/peterpeterparker/blog-to-standard-site)

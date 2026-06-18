---
title: "Blog to Newsletter"
description: "A GitHub Actions pipeline that turns blog posts into newsletters."
type: "play"
status: "active"
order: "4"
---

# Blog to Newsletter

I built this pipeline to automate my own newsletter. When I merge a pull request adding a new blog post on this website, it reads the post, generates a newsletter using Claude, creates a draft in Mailchimp, and sends me a Telegram message to review and approve before anything goes out.

The approval flow is handled by a companion Cloudflare Worker that receives Telegram webhook callbacks and calls the Mailchimp API accordingly.

Fun fact: I coded it mostly in Shinkansen's trips during a month-long holiday in Japan.

---

## Fact sheet

**Technology:** [TypeScript](https://www.typescriptlang.org/) and [GitHub Actions](https://github.com/features/actions)

**Platforms:** [Claude](https://anthropic.com), [Mailchimp](https://mailchimp.com/), [Telegram](https://telegram.org/) and [Cloudflare Workers](https://workers.cloudflare.com/)

**GitHub:** [blog-to-newsletter-action](https://github.com/peterpeterparker/blog-to-newsletter-action) and [blog-to-newsletter-worker](https://github.com/peterpeterparker/blog-to-newsletter-worker)

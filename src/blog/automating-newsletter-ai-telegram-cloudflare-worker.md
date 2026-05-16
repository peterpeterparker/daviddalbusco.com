---
path: "/blog/automating-newsletter-ai-telegram-cloudflare-worker"
date: "2026-05-16"
title: "Automating My Newsletter with AI, Telegram, and a Cloudflare Worker"
description: "How I built a GitHub Action that reads a new blog post, generates a newsletter draft with Claude, and sends it to Mailchimp after a Telegram approval tap."
tags: "#ai #github-actions #cloudflare #telegram #mailchimp #typescript #bun"
image: "https://daviddalbusco.com/assets/images/TODO.jpg"
---

Every time I publish a blog post, I want my newsletter subscribers to hear about it. The problem is I kept forgetting to actually send it. So I decided to automate the whole thing, but with a human-in-the-loop step before anything goes out.

The result is two open-source projects:

- [blog-to-newsletter-action](https://github.com/peterpeterparker/blog-to-newsletter-action): a GitHub Action that detects a new post, generates a newsletter with Claude, creates a Mailchimp draft, and pings me on Telegram for approval
- [blog-to-newsletter-worker](https://github.com/peterpeterparker/blog-to-newsletter-worker): a Cloudflare Worker that receives the Telegram button taps and acts on them

---

## How it works

When a PR that adds a new blog post is merged to `main`, the action kicks in:

1. It calls the GitHub API to find which `.md` files were added in that commit
2. Reads the content of each post
3. Sends everything to Claude with a prompt asking for a short, punchy newsletter
4. Creates a draft campaign in Mailchimp
5. Sends me a Telegram message with the subject, preview text, and three buttons: Send Test Email, Discard, and Approve & Send

Tapping a button hits the Cloudflare Worker, which calls the appropriate Mailchimp endpoint and edits the Telegram message to confirm.

---

## The interesting parts

A few things that came up during the development that I thought were worth sharing.

### Detecting added files via the GitHub API

My first instinct was to use `git diff` inside the Docker container. It just turned out not to work: the workspace is mounted by GitHub Actions and owned by root, but the container runs as the `bun` user, so git kept throwing permission errors on `.git/FETCH_HEAD`, `.git/shallow`, and a few other files it needed to write to. Some might argue that I could have just run the app as root of course but, that's IMO a bad practice.

I eventually switched to the GitHub API instead. The commits endpoint returns exactly what I need, the list of files added in a commit, and it requires no filesystem access at all:

```typescript
const response = await fetch(`https://api.github.com/repos/${repository}/commits/${sha}`, {
	headers: { Authorization: `Bearer ${token}` }
});
```

Much simpler, zero permission issues.

### Prompting Claude for a newsletter

The prompt is extracted into a `prompt.md` file and imported as text using Bun's native text import:

```typescript
import prompt from "./_prompt.md" with { type: "text" };
```

The file uses `{{author}}`, `{{audience}}`, and `{{posts}}` as placeholders, replaced at runtime. Having the prompt in a Markdown file makes it much easier to iterate on without touching the code. Moreover, if the action ever gets more widely used, it would also make it straightforward for consumers to swap in their own prompt entirely.

The key constraint in the prompt though is handling the respond only with valid JSON, no markdown fences, no preamble.

Despite that, Claude occasionally wraps the response in ` ```json ` fences anyway. So I strip them before parsing:

````typescript
const raw = content
	.join("")
	.replace(/^```json\s*/i, "")
	.replace(/^```\s*/i, "")
	.replace(/```\s*$/i, "")
	.trim();
````

### Embedding test emails in the callback data

The Telegram approval message optionally includes a Send Test Email button. That button needs to know which email addresses to send to, but the Cloudflare Worker has no access to the action's environment, by design. I did not want consumers to have to configure the same emails in two places, so the Worker only sees what Telegram sends it.

The solution: embed the emails directly in the button's `callback_data`:

```
test:campaignId:email1@example.com,email2@example.com
```

The Worker parses the callback data, extracts the emails, validates them with Zod, and calls the Mailchimp test endpoint. No shared state, no extra secrets in the Worker.

### Not editing the message after a test email

After sending a test email, I originally called `editMessage` to append a confirmation line. That removed the Approve and Discard buttons from the chat, which meant I was stuck with no more actions. So I just dropped the `editMessage` call for the test action. When you tap "Send Test Email" you are supposed to get an email anyway, that's your feedback.

---

## The architecture

Both projects follow the same pattern throughout: classes with a private constructor and a static `create()` method that validates required env vars on instantiation, throwing immediately if anything is missing. For everything else, no function throws but always returns a result.

> If you read my previous blog post, you know that's a pattern I inherited from Rust which I really like for its clarity.

```typescript
static create(): Mailchimp {
  const { MAILCHIMP_API_KEY } = process.env;
  assertNotEmptyString(MAILCHIMP_API_KEY, "MAILCHIMP_API_KEY");
  return new this({ apiKey: MAILCHIMP_API_KEY });
}
```

Each class is decorated with a provider interface (`@NewsletterProvider`, `@AIProvider`, etc.). The decorator enforces that the class implements the expected interface and exposes a static `create()` method, making the boundaries explicit and the implementation swappable. Mailchimp, Claude, and Telegram can all be replaced without touching the orchestration logic.

Worth noting: I could have used abstract classes instead, but abstract classes in TypeScript cannot enforce static methods. A decorator on a concrete class is the cleanest way to enforce both the instance interface and the static factory method at the same time.

Zod codecs handle the mapping between domain types and API wire formats, keeping the API call sites clean:

```typescript
const response = await fetch(`${this.#apiUrl}/campaigns`, {
	method: "POST",
	headers: {
		Authorization: `Bearer ${this.#apiKey}`,
		"Content-Type": "application/json"
	},
	body: CreateCampaignCodec.decode({
		settings: { ...this.#campaignSettings, subjectLine: subject, previewText },
		recipients: this.#campaignRecipients
	})
});
```

### Security

A few small things worth calling out. The Cloudflare Worker only accepts POST requests to `/telegram/<TELEGRAM_SECRET>`, where the secret is a random 32-character string set as a Worker secret. Anything hitting the wrong path gets a 403. The Telegram bot token and Mailchimp API key are stored as Worker secrets and never exposed in code or logs.

On the action side, the `actions/checkout` step uses a pinned commit SHA and `persist-credentials: false`. The action itself is also pinned by SHA in the caller workflow, so a new release never silently changes behavior.

### Lean dependencies

Given how many npm supply chain attacks have made the news lately, I kept the dependency footprint small on purpose. Both projects share a single runtime dependency: `zod`. Everything else is built on standard Web APIs and Bun built-ins.

### Extensibility

The provider pattern makes it relatively straightforward to swap out any of the three services. Want to use SendGrid instead of Mailchimp? Implement the `NewsletterProvider` interface and swap the class in `action.ts`. Prefer a different AI model or provider? Same story with `AIProvider`. This also means that in the future, the orchestration logic could be refactored to depend only on interfaces rather than concrete implementations, making swapping providers even more seamless.

---

## Conclusion

If you publish a blog and send newsletters, feel free to fork [blog-to-newsletter-worker](https://github.com/peterpeterparker/blog-to-newsletter-worker) and drop [blog-to-newsletter-action](https://github.com/peterpeterparker/blog-to-newsletter-action) into your repo. It's been running on this site since this post was published.

Until next time!
David

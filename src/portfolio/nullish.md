---
title: "nullish"
description: "Swiss accounting with AI assitant."
icon: "/images/portfolio/icons/nullish-icon.png"
type: "play"
order: "1"
---

# nullish

[nullish](https://nullish.ch) is a Swiss accounting app with an AI assistant. It covers invoicing, banking, and VAT, and it's open source and self-hostable.

It started as a way to get away from the accounting tool I had used for years, which had become overpriced for a tool with a lame UI/UX and poor support. As the project moved forward, the idea of turning it into a real product, if there was enough demand, started to make sense, along with disrupting the market a bit. There are many, maybe too many, accounting solutions for the Swiss market nowadays, but none that are self-hostable, open source, and well engineered at the same time, values that are important to me.

Aside from all the basics you would expect from such a product (clients, invoices, Swiss QR-bills, bank imports and reconciliation, the journal, VAT with net rate or effective method, balance sheet, income statement, year-end closing, inviting colleagues, an accountant, or a reviewer, etc.), I took a few different approaches.

First, I integrated an AI assistant instead of a dashboard, giving users the ability to find what they're looking for themselves. I plan to extend the AI to other features too, for example to integrate it into processes like bank reconciliation.

I also took a stance on privacy. I never understood why most accounting systems leak information through QR-bills that could easily be anonymized. I also brought over a few things I learned while being active in the crypto sphere.

Last but not least, it was interesting to set up an infrastructure that exists only in Switzerland for data sovereignty reasons, including AI and email notifications, all with the appropriate security measures in place.

![A screenshot of the nullish app](/images/portfolio/screenshots/nullish.webp)

---

## Fact sheet

**Website:** [nullish.ch](https://nullish.ch)

**Technology:** [TypeScript](https://www.typescriptlang.org/), [Bun](https://bun.sh/), [Hono](https://hono.dev/), [React Router](https://reactrouter.com/), [PostgreSQL](https://www.postgresql.org/), [Drizzle](https://orm.drizzle.team/) and [MCP](https://modelcontextprotocol.io/)

**Infrastructure:** Swiss hosting ([details](https://nullish.ch/en/data/)), deployed with [Docker](https://www.docker.com/) and [Nix](https://nixos.org/)

**GitHub:** [usenullish/nullish](https://github.com/usenullish/nullish)

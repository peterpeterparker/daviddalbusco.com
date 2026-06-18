---
title: "Yet Another Web Analytics"
description: "A self-hosted web analytics, with MCP."
type: "play"
order: "1"
---

# Yet Another Web Analytics

After deprecating my project [Juno](/portfolio/juno/), I was seeking a new privacy-friendly analytics solution I could self-host. Since I already had the logic and some reusable code, I thought: why not build yet another web analytics, again 😅.

As I was conceptualizing the solution and since I rarely open the statistics dashboards anyway, I thought about taking a radically different approach: no dashboard.

Instead of querying data through a UI, I went full in on the Model Context Protocol (MCP) to make the analytics solely browsable by asking Claude or any compatible AI client questions about your traffic in plain language.

```
❯ list my analytics sites

You have one registered site:

┌──────────────────────────────────────┬────────────────┬────────┐
│                  ID                  │    Hostname    │ Status │
├──────────────────────────────────────┼────────────────┼────────┤
│ 019ed922-33e5-7b9e-a072-963680861c6f │ yourdomain.com │ active │
└──────────────────────────────────────┴────────────────┴────────┘

❯ what are my top pages this week?

Top pages this week (Jun 15–18):

┌───────────────────┬──────────┬───────────┐
│       Page        │ Visitors │ Pageviews │
├───────────────────┼──────────┼───────────┤
│ / (homepage)      │ 312      │ 489       │
│ /blog             │ 201      │ 334       │
│ /about            │ 98       │ 121       │
│ /blog/hello-world │ 87       │ 103       │
└───────────────────┴──────────┴───────────┘

Your homepage leads, with the blog close behind.
```

---

## Fact sheet

**Technology:** [TypeScript](https://www.typescriptlang.org/), [DuckDB](https://duckdb.org/) and [MCP](https://modelcontextprotocol.io/)

---

## Open source

This project is open source and available on [GitHub](https://github.com/peterpeterparker/yawa)

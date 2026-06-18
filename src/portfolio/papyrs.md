---
title: "Papyrs"
description: "An open-source, privacy-first, decentralized blogging platform that lives 100% on chain."
icon: "/images/portfolio/icons/papyrs-icon.png"
background: "#ffecd6"
type: "play"
status: "archived"
order: "6"
---

# Papyrs

> This project is deprecated.

Papyrs was an open-source, privacy-first blogging platform which entirely ran on the Internet Computer. No servers, no cloud provider. Content and data lived fully on-chain, with the idea that authors owned their content.

![A screenshot of the Papyrs blog editor](/images/portfolio/screenshots/papyrs.webp)

## Architecture

The application primarily worked offline and could therefore be used by anyone out of the box. It used [Internet Identity](https://id.ai) as anonymous authentication provider. Each author got their own dedicated canisters on the Internet Computer: one for private data and drafts, one for published static content served directly to readers.

![A schema of the architecture of Papyrs](https://raw.githubusercontent.com/papyrs/papyrs/main/docs/papyrs-architecture-ic.png)

## Fact sheet

**Website:** [Papyrs](https://papy.rs/)

**Technology:** [SvelteKit](https://kit.svelte.dev/) and [StencilJS](https://stenciljs.com/) for the frontend dapp. [Rust](https://www.rust-lang.org/) and Motoko for the smart contracts.

**Infrastructure:** [Internet Computer](https://internetcomputer.org/)

**GitHub:** [papyrs/papyrs](https://github.com/papyrs/papyrs)

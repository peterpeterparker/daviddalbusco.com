---
path: "/blog/wrapped-2025-and-onward"
date: "2025-12-19"
title: Wrapped (2025) & Onward
description: "Extending collaboration, Juno's reality check, and some ideas for 2026."
tags: "#yearinreview"
image: "https://daviddalbusco.com/assets/images/rene-bohmer-YeUVDKZWSZ4-unsplash.webp"
---

![Cover photo from Unsplash by Rene Böhmer](https://daviddalbusco.com/assets/images/rene-bohmer-YeUVDKZWSZ4-unsplash.webp)

> Photo by [Rene Böhmer](https://unsplash.com/fr/@qrenep?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/fr/photos/a-very-long-line-of-yellow-lines-on-a-black-background-YeUVDKZWSZ4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

**TLDR**:

- I'll likely be available for freelance hire as of May 2026
- The DFINITY Foundation is still sponsoring Juno for the next few months

---

My life isn't particularly interesting, but since a few people are using [Juno](https://juno.build), the platform I'm developing, I figured now that things are finally clear — and square, psycho-rigid old guy here — I should reflect on the year that passed and share what comes next.

Long story short: the [DFINITY Foundation](https://dfinity.org/) and I have agreed to extend our collaboration until the end of April 2026. This year, my main task was improving the [Internet Computer](https://internetcomputer.org/) ecosystem and adoption by developing Juno. The upcoming period shifts focus—I'll be building things and providing consulting for the Foundation.

The good news for you: while no longer the primary focus and the sponsorship is reduced, the Foundation will continue supporting Juno and I'm really grateful for it.

I'm obviously biased, but this makes sense (to me at least): I'm reaching developers outside the blockchain bubble (especially trying to reach those who hate crypto), and they're actually using Juno for their own pipelines and projects (like the JavaScript SDK documentation site). Not bad to have me around if you're using my tools 😄.

At this point however, you might be asking yourself: yeah that's great David, but what happens after April then?

Let me be honest: without renewed sponsorship or wider adoption, Juno will likely enter some sort of maintenance mode.

The platform hasn't reached the massive adoption needed to be financially self-sustainable yet. And I have little interest in convincing VCs—I'm not great at that dance, and frankly, I don't want to deal with investors who don't get it.

Of course, it's startup life—ups and downs. Right now I'm maybe more in a down, doubting whether I'll ever reach the masses.

Because let's be frank: Juno is a great alternative, but it's a little fish in a crowded, established market. Developers already have solutions that work for them. Convincing them to try something fundamentally different (even if the DX is relatively similar), especially when it's built on different infrastructure with likely fewer features (currently), is an uphill battle.

Plus, I almost completely failed to catch the AI wave (not that I really try) and more generally, I feel like devs aren't interested in changing their habits. Vercel had two major security incidents and their CEO befriended a war criminal (I'm talking about Guillermo Rauch [taking selfies](https://x.com/rauchg/status/1972669025525158031) with Netanyahu) — nothing changed. Habits die hard.

So yeah, it's tough work, I might not be doing it always right, but I'll continue doing my best to push for the next few months. We'll see where it lands — hopefully on the moon! 🚀

---

## By the Numbers

For once, let's not get too technical — you can find everything that was released on Juno this year on the [website's blog](https://juno.build/blog) — but rather let me share some numbers that are a bit more juicy.

Since February 2023 — damn, almost three years already — **2,410** potential developers have signed into Juno's Console. I purposely don't track retention rate, meaning I don't know exactly how many of those really built something with it, but I'd estimate the number is low, maybe 2% or something.

That said, my estimation might be too pessimistic as I'm more a glass-half-empty guy on that matter. There are some metrics I can't disclose that are actually more positive and validate the fact that Juno as a hosting provider has found its market fit, at least on the Internet Computer.

On average, I estimate new monthly sign-ups to be between **60-100**. It strongly depends on how active I am in terms of promotion.

One interesting thing though: this year I (finally) introduced native [Google sign-in](https://juno.build/blog/google-sign-in-comes-to-juno) — i.e., devs can implement Google sign-in in their own projects or sign into Juno directly with their account without using Internet Identity, the authentication provider developed by the Foundation for the Internet Computer. And one number speaks for itself: I introduced this method on Oct. 25, and since then there were **83 sign-ups** with Internet Identity versus... **75 with Google**.

The number of sign-ins with Google is about to overtake the majority. This confirms this was an interesting move and opens up some possibilities for the future.

In terms of SEO, I have to say it could be improved. We — a friend of mine is helping with marketing — invested some time and effort to refine our approach and it's starting to improve, but it's a process that takes time.

On that particular topic, one important move this year was deprecating and removing as much as possible crypto, blockchain, web3, and other mumbo jumbo slang. The target for Juno, the hope, is reaching developers who have no interest, clue, or even dislike that field. So I refined the message multiple times and continue to do so. That's how I landed on a tagline and description that say:

> Build serverless apps with self-hosting control  
> Juno is an open-source serverless platform to build, deploy, and run apps in WASM containers with complete ownership and zero DevOps

This refined message and unleashing Google sign-in unlocked new opportunities. Thanks to it, I was able to start featuring the platform in various aggregated lists or documentation related to web developer tools that aren't necessarily related to or blockchain-friendly. Hopefully those backlinks will start to shine at some point!

When it comes to following, there are 1,400+ followers on Twitter and 230 members on Discord. It's maybe not as active as I wish it could be, but I definitely feel like there's a little supportive community and it's great to have everybody around 💙.

GitHub stars wise, Juno is still not that famous a project — not that stars are an obsession, but they do disclose how trendy something is or not. That said, there was a nice push in September, so hopefully it will continue that way. And if you haven't yet starred Juno, now is the time, old man or woman 😉.

👉 [https://github.com/junobuild/juno](https://github.com/junobuild/juno)

![343 stars on Github on Dec 19, 2025](https://daviddalbusco.com/assets/images/20251219-juno-github-stars.png)

---

## My Ideas for 2026

I can't build everything — reduced sponsorship means reduced resources — but I'll try to ship at least one of these (probably team support) in the next few months.

### GitHub Integration

GitHub integration was actually one of my goals for 2025. Not just GitHub Actions, but real integration—sign-in with GitHub, automatic deployment through GitHub Apps, etc.

Despite some proof of concepts and analysis, there wasn't a clean solution without compromising too much on either ownership or security (or putting too much responsibility on my shoulders). That is why it did not happen yet.

However, things have changed. Implementing Google sign-in meant building OpenID support. GitHub still only uses OAuth, which can't be integrated directly for the reasons above, but I think I might be able to work around this with a proxy server (that anyone can validate). It's just an idea at this point, but I think there is an opportunity here.

If I want to compete with traditional dev experience, better GitHub integration is a must. And by "better integration," I don't mean an "export" button like some platforms do—I mean real integration with as little compromises on values as possible.

### Team Support

More and more teams, small and large, are using my platform. There are workarounds to share projects, but it's not officially supported. Since the Foundation is both using Juno and requires team features, I see some synergy here.

Moreover, I'm currently working on big changes to merge Mission Control and monitoring tools into a single umbrella or in other words, I'm making the platform even more microservices-oriented. Implementing team support fits that narrative well.

### SQL Support

I'll cut it short: I don't think SQL is the silver bullet that will suddenly make Juno massively adopted. However, the current datastore approach definitely has its requirements and limitations. It has advantages too, but providing devs a more familiar database-like experience would be really useful and can unlock some ideas.

When I started Juno three years ago, I actually wished I could have used that technology, but it wasn't there yet. This year, some new crates were published on the IC, and even [rusqlite](https://github.com/rusqlite/rusqlite/pull/1769#issuecomment-3650506988) became compatible just last week. That's why it would now be possible to move in that direction.

That said, I'm well aware of the security implications, and there's no way I would introduce anything insecure or unmaintainable.

But think about it: once you have SQL with a nice GUI on top, together with all of Juno — that would be quite awesome.

### Self-Hosting

Last but personally not least, I'd like to improve self-hosting. Not just allowing devs to run projects with privacy and self-hosting control, but also letting devs and companies host their own version of Juno.

Think about it — you wouldn't just develop your project, but you'd also have your own instance of the platform and all the tooling.

I already did this to some extent this year — the local emulator now ships the entire Juno. Going a step forward and offering that level of control and self-hosting for production would be really slick, in my opinion.

---

## Thanks & Onward

Before I wrap this up, I want to thank everyone who's been supporting, using, promoting, or helping [Juno](https://juno.build) this year — it means a lot! I hope you'll continue to stick around through 2026, or at least the next few months.

The path forward is uncertain but, we have some buffers and rebellions are made of hope, aren't they?

I wish you a merry Christmas and a lovely end of year! 🎄

David

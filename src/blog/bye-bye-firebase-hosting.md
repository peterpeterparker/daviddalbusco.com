---
path: "/blog/bye-bye-firebase-hosting"
date: "2025-02-25"
title: "Bye Bye, Firebase Hosting $$$"
description: "I’ve been using Firebase Hosting for the last six years, but the new pricing changes have pushed me away."
tags: "#firebase #hosting #pricing #juno"
image: "https://images.unsplash.com/photo-1606145166375-714fe7f24261?fm=jpg&q=80&w=1080&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
---

![](https://daviddalbusco.com/images/blog/1*rkJkG5mkhIDjcJrCR1fivQ.jpeg)

> Photo by [Marija Zaric](https://unsplash.com/fr/@simplicity?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/fr/photos/blanc-et-noir-je-taime-impression-sur-mur-en-beton-gris-q73jLftKN-A?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

---

I’ve been using Firebase to host my website — [daviddalbusco.com](https://daviddalbusco.com/) — for the last six years. It was convenient and “free” (quotes intentional because, one way or another, Google makes money).

But recently, they changed their pricing model, and well... let’s just say it’s not great. This month alone, I’m set to pay $30 for hosting a simple static site. That feels excessive. I mean, sure, my site serves 2.6GB of data a day, which is over their 360MB free limit, but still — $30? That’s 2–3 times the price of Netflix or Spotify 🤷‍♂️.

![](https://daviddalbusco.com/images/blog/1*tvNeqm3X1W0YHGt8tOX3tA.png)

And for context, based on the data I have, my traffic hasn't changed - January and February had the same numbers. Some might argue I should focus on blocking bots that generate excessive traffic, and fair enough, I've started looking into it. But the reality is, I never had to worry about it - until Firebase changed its pricing.

![](https://daviddalbusco.com/images/blog/1*pWv3bYVG7HYNrzG2nt-YEQ.png)

So yeah, I’m moving to [**Juno**](https://juno.build/). 🚀

---

## "Wait… What? You hadn't already migrated to Juno?"

If you’ve been following my work, you might be wondering:

> “Dude... Juno is literally your project. Why were you still on Firebase?”

And here’s my confession: **I knew**. I was fully aware my site was still on Firebase. In fact, moving it to Juno was always this unspoken goal I had — kind of like putting the cherry on top. I told myself I’d make the switch the day Juno became a DAO. A way to mark that milestone and personal achievement.

But hey, Firebase “forced” my hand, so here we are.

---

## What About Costs?

So how does Juno compare?

On the **[Internet Computer](https://internetcomputer.org/)** — the blockchain that super powers Juno - costs come from storing data and updating state, but querying data — like accessing a website — is currently free. That means as long as this remains the case, hosting a static site on Juno is **cheap**.

I haven’t done the exact math, but I expect it to cost me **around $10 for an entire year**. Yep, **a whole year** for what Firebase was about to charge me in **10 days**.

And even if it ends up being $20 - it's still less than what I paid this month.

Now, obviously, if your site is dynamic and frequently updates state, costs will be different. But for a static site like mine? **Juno now wins, hands down.**

---

## Moving to Juno: A Quick Guide

If you’re in the same boat and want to migrate to Juno, here’s what you need to do:

#### 1. Sign in to Juno

Go to [console.juno.build](https://console.juno.build) and sign in. If you don’t have an **Internet Identity (II)** yet, create one. It’s a decentralized, open-source, privacy-friendly authentication method — meaning **you own your data**.

Oh, and by the way — **starting on Juno is free**, so be my guest! 🎉

#### 2. Create a Satellite

A Satellite is like a container for your project. Not exactly like a Docker container — it’s a **smart contract** — but you can think of it as something similar, running on a blockchain. Because yes, everything on Juno is **on-chain**. Magic! ✨

#### 3. Set Up GitHub Actions

You’ll need to:

- Generate and add a secret to your repo.
- Add a config file to your project.
- Set up a GitHub Action to handle deployment.

Everything is well-documented ([here](https://juno.build/docs/guides/github-actions)), so just **follow the step-by-step guide** and copy-paste what you need.

#### 4. Deploy On-Chain

Once the action runs, **boom — your site is deployed on-chain**. No extra steps. How wonderful.

#### 5. Update Your DNS

Now, time to connect **your domain name**:

- Remove any existing DNS entries you had for Firebase.
- Head over to the **Hosting tab** in the [Juno Console](https://console.juno.build/) and register your domain.
- The UI will give you the new DNS records to add, and the docs have extra guidance if needed.

#### 6. Delete Your Firebase Project

Finally, clean up:

- Delete your Firebase project so you’re not charged anymore.
- **Remove your credit card from Firebase** if you don’t need it there.

And that’s it — you’re free! 🚀

---

## Need Help? Ping Me!

If you run into any issues migrating to Juno, **let me know**. Always happy to help.

To infinity and beyond,  
David

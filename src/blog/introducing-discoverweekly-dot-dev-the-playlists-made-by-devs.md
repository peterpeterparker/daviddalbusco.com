---
path: "/blog/introducing-discoverweekly-dot-dev-the-playlists-made-by-devs"
date: "2021-02-22"
title: "Introducing DiscoverWeekly.dev: The Playlists Made By Devs"
description: "I developed an open source website to discover new music on a weekly basis without an algorithm."
tags: "#showdev #webdev #motivation #music"
image: "https://cdn-images-1.medium.com/max/1600/1*GFDCqLv-kxGco-IWWlwtJw.png"
canonical: "https://daviddalbusco.medium.com/introducing-discoverweekly-dev-the-playlists-made-by-devs-66e9d14f6e05"
---

![](https://cdn-images-1.medium.com/max/1600/1*GFDCqLv-kxGco-IWWlwtJw.png)

Like everyone in the current situation, I miss being able to do a lot of different things such as hugging my mum, attending live events or being able to travel.

Recently, I also noticed I began to miss some immaterial things too, notably discovering new music to listen to totally unpredictably and not through an algorithm. Those bands and songs for which I fall in love for no other particular reason than the fact that they remind me a good memory.

[The Upsetters](https://www.youtube.com/watch?v=e1dt57Uq2hU&list=PL0B8FFFE57D5024AE)? Discovered at the [IQ Bar](https://www.iq-bar.com/) in Zürich, end of Summer when these were still open. We were having a drink with my friend Anatole. The background music was spreading a chill vibe in the all place. I ordered the vinyl as soon as I went back home.

[Violent Soho](https://www.youtube.com/watch?v=RN9NC4iQcsA)? I am their biggest fan because an Australian guy, Jake, who I met in Bali, recommend them to me once I told him I just visited Brisbane.

[Skuggan av Svampen](https://www.youtube.com/watch?v=vd_G92JIIaw)? I met a Swede called Seamus in Ahangama, Sri Lanka. We were surf buddies for a week and, we chit chatted about music. It turned out he was also a MC.

That’s why, I created [DiscoverWeekly.dev](https://discoverweekly.dev/), a place where developers can share their favorite music by [contributing](https://github.com/peterpeterparker/discoverweekly.dev#contributing) to an open source repo.

<iframe width="280" height="158" src="https://www.youtube.com/embed/uohpcHeR_E8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<br/>

---

### Contributing

To share your favorite playlists, bands or songs, those you like to hear when you are coding or, those you simply just like to hear any time, you can submit your tips through a Pull Request.

> This process is really similar to the one of [Tiny Helpers.dev](https://tiny-helpers.dev/), thank you [Stefan Judis](https://twitter.com/stefanjudis) for inspiration.

First, clone and fork the [repository](https://github.com/peterpeterparker/discoverweekly.dev). Then, either create manually a new `Markdown` file or, if you have a recent version of [Node.js installed](https://nodejs.org/en/), head over to your terminal and run the following command:

```markdown
git clone git@github.com:[YOUR_USERNAME]/discoverweekly.dev.git
cd discoverweekly.dev
npm ci
npm run add:playlist
```

Continue by editing your contribution, commit the changes and open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

The playlist you are submitting should contain some `meta` information about yourself, it is important to me to give back credits on the website to the contributors, and your music tips. You can either provide `Youtube` or `Spotify` urls.

All details regarding these information and formatting are described in the [CONTRIBUTING.md](https://github.com/peterpeterparker/discoverweekly.dev/blob/main/CONTRIBUTING.md).

```markdown
---
date: "2021-02-23"
name: "David Dal Busco"
description: "Hello, I'm David, a freelance web developer 🤓"
profile: "https://pbs.twimg.com/profile_images/..._400x400.jpg"
twitter: "daviddalbusco"
github: "peterpeterparker"
website: "https://daviddalbusco.com/"
tags: "#postmetal #electro"
---

# Deafheaven

Their black metal in major cord is epic! Perfect to write a zillion lines of code. I have seen them three times live, hopefully one day at least a fourth time 🤞.

{% youtube sC3V6DU-o9k %}

---

# Post French Touch

A playlist with my favorite electronic tracks made in France🇫🇷.

{% spotify playlist 3D6BESfLFj08osOqclOhFl %}
```

---

### Following

You are obviously most welcome to check out a weekly basis the website (😇) but, you can also follow one of these channels if you want to stay up-to-date with the new shared playlists:

- [Twitter](https://twitter.com/discoverweekly_)
- [RSS feed](https://discoverweekly.dev/rss.xml)
- [Spotify](https://open.spotify.com/playlist/1psyoVD1j3KOBBKADkJNat?si=a7ca738f5f42441d&nd=1)

---

### Summary

There is always some uncertainty when starting a new side project whether someone will contribute or not. Fortunately here, some contributors already shared their playlists, submitted PR or reviewed the website. I am definitely fortunate to have such wonderful people in my network, thank you all for your help 🙏.

Looking forward to discover new music through your contributions.

To infinity and beyond!

David

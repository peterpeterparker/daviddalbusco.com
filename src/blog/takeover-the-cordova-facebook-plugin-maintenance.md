---
path: "/blog/takeover-the-cordova-facebook-plugin-maintenance"
date: "2020-03-27"
title: "Takeover The Cordova Facebook Plugin Maintenance"
description: "I am giving up being the active maintainer of the Cordova Facebook Plugin. Anyone willing to replace me?"
tags: "#facebook #cordova #motivation #meta"
image: "https://cdn-images-1.medium.com/max/1600/1*EPWjs7wN0Q2-8F2EeaiIqw.png"
canonical: "https://medium.com/@david.dalbusco/takeover-the-cordova-facebook-plugin-maintenance-e0ffd09cacd0"
---

![](https://cdn-images-1.medium.com/max/1600/1*EPWjs7wN0Q2-8F2EeaiIqw.png)

_Photo by [Thought Catalog](https://unsplash.com/@thoughtcatalog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/facebook?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-three** days left until hopefully better days.

---

It has been in my mind for a while now and I think that, even if this post is not really going to be trick, this series of article is the perfect time to announce that I am giving up being the active maintainer of the [Cordova Facebook Plugin](https://github.com/jeduan/cordova-plugin-facebook4).

This entry will be a bit more metaphysical than usual, I will tell you my story, how and why I ended up being the maintainer and also present what I did as such (not that much actually).

But more **important**, I would rather like not to sunset my duties without anyone taking over the shift.

Therefore, if you are up to become the new active maintainer, **ping me** 🙏.

---

### How Did I Become The Maintainer?

Funny story, I have almost no clue of objective-C. I did have a Java background, that’s why I can understand and write Android code but the iOS part? Mostly interpretation and using spider-sense 😉.

You may ask yourself, but then, how come did you became the maintainer of a Cordova plugin?

Three or four years ago (times fly), after a corporate career as junior and then senior developer, business analyst, project manager, team leader, company manager etc. etc. I was looking for something new and decided to try to build my own “startup”. Nowadays I use the term “startup” with quotation marks because at the end of the day, I was just a guy alone trying to do his best.

This “startup” was [Fluster](https://fluster.io), a simple search for roommates and flats platform which I created because finding a new place to live in Zürich freaking sucks (excuse my french) and which, by the way, I am also about to sunset really soon.

This platform was a mobile application developed with [Ionic](https://ionicframework.com) (early version 4) and [Cordova](https://cordova.apache.org) available in the [App Store](https://itunes.apple.com/app/id1187266720), [Google Play](https://play.google.com/store/apps/details?id=io.fluster.fluster) and as a [Progressive Web Apps](https://m.fluster.io).

To design its UX and develop it, I mostly decided to rely on the Facebook login and platform for two reasons:

1. When it goes to mobile devices, I don’t like to enter data. I also don’t like when the onboarding takes to much steps and is slow
2. Back then, Tinder was really big

After a year or something, I added a Google Login support too but most of the users were still using the Facebook one.

Long story short, if I remember correctly, there was one day a bug in the Cordova Facebook Plugin which could had only been solved by updating the Facebook SDK. [Jeduan Cornejo](https://twitter.com/jeduan), the author of the plugin, was not interested anymore to maintains it, therefore I provided a pull request, he granted me as a maintainer, I merged my own pull request and that was it, it was the begin of my activities.

Looking back at the history of the [CHANGELOG](https://github.com/jeduan/cordova-plugin-facebook4/blob/master/CHANGELOG.md) I notice that it actually all began around two years ago, somewhere around March 24th 2018. So I’ve been a maintainer for two years.

---

### Why I Gave Up?

First of all, I gave up being a maintainer of this plugin because **I don’t use it** anymore and this since probably more than a year as I stopped being active in Fluster (the application, not the company) more than a year ago. It means that I remained the maintainer even without having any interest to it for quite a while. I don’t want to be praised for that or anything else I did regarding these activities, I’m just saying it out at loud to explain my motivation, don’t misunderstand me about this.

Furthermore, I don’t want to use it anymore. Since Fluster, I never ever implemented Facebook login again. I even don’t implement the option to share to this platform in all my personal recent work.

---

### Facebook (The Company) Sucks

Excuse my french again 😅. Most probably, almost no one nowadays is going to say that he/she likes Facebook. We are all aware that Facebook, the company, is evil. Between scandals, leaks, data breaches, data sold, etc. nothing can probably change this really soon. I say “probably” because for example in the 90s Microsoft used to be known as evil too but they managed to make good things to become respectable. Before them, IBM used to be seen as evil too but nowadays there are just…well there are just still alive, like always. IBM is going to be there somewhere selling super complicated solutions for ever 🤣.

But, regarding my above point on view on Facebook, here are two things you might not know:

---

#### Worst Communication Ever

At the time all data breaches appeared in the news, Facebook began to chase their leaks in order to fix these, or maybe to hide more of these, who knows. From my external developer eyes who was using there API, I noticed that they did so because they began to ship updates really fast, so fast that sometimes they even deprecated services and only released the release notes informing you that these were down afterwards. I remember having seen things being stop and reading about it one day later.

They also did changes to their server infrastructure and sometimes stopped them for days without any prior information or any explanations afterwards.

I will never forget one particular incident. Suddenly it was not possible anymore to display users profile pictures. After tracking down the problem and spent several hours in the issue tracker of Facebook, I finally figured out that one issue was really close to mine. At some point, we were more than 500 people around the world following the exact same issue. During the night, Facebook decided to change the status of the issue from “open” to “in progress” and finally solved it around two days later. I never ever heard or read any explanations about what happened. I don’t even ask for apologies, I mean problems happens, but no comments, no messages, nothing, that's a pity.

Since that day I always tell to my self, sort of my private joke, that the communication of Facebook should be taught in schools as an example of how to communicate badly with developers.

---

#### Facebook Do Not Delete Ads Profile

As much as I criticize Facebook, I am also, even more strongly, criticize my self.

When I developed Fluster I tried to reach my audience mostly with Facebook and Google ads. Probably because that’s what I learned in previous jobs. Concretely I invested of couple of thousand dollars of my private savings over several months to try to grow my business. Even if I was believing in it, I kind of feel bad about it. I am really not proud of my self to have tried to use ads, I mean, it’s ads, it is not cool and money can be use so much more wisely.

But at least the good point of this, is that I learned from what I consider as I a personal error and it probably helped me to become the person I’m today, or at least helped me to be more aware of what I want in life, what I want to achieve and more important, how.

That being said and here is my point. Even though my decision was bad, I should be able to delete my data. In Europe there is GDPR, which we don’t really have in Switzerland, but still, I should be able to request a deletion of my data right? Guess what, Facebook don’t wand and don’t allow deletion of Ads related profiles. No matter what, your data are going to stay there for ever.

Oh and by the way, Google is not better on that point, you cannot delete Google Ads profile neither.

---

### Maintainer Duties

Bad or good, the Facebook login is still used by a lot of applications, more than 6'000 downloads a week on [npm](https://www.npmjs.com/package/cordova-plugin-facebook4), probably a lot of these are doing some good and it still needs a maintainer.

As such, I mostly did the following activities:

- Taking care of maintaining a clear issues tracker. Most the time, issues were actually support request, therefore I kindly asked developers to use other platform to handle these as otherwise it would have made the real issues really not trackable and not noticeable
- Updating the documentation according developer inputs
- Merging important Pull Requests
- Updating the Facebook SDK
- Providing a sample repo to help with the testing but more important, to help reproduce submitted issues

Of course you will be able to organize yourself as you wish and I even now think that having a new active maintainer might bring some fresh ideas to the plugin.

---

### Summary

This opinionated blog post contained a lot of Facebook bashing, probably too mush, but facts don’t speak currently for this company. Hopefully they will be able in the future, as Microsoft and other did, to gain again a credibility, hopefully by giving their talented employees the opportunities to improve things which I am convinced they all are eager to change.

Stay home, stay safe!

David

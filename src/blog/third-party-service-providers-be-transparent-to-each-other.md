---
path: "/blog/third-party-service-providers-be-transparent-to-each-other"
date: "2020-04-06"
title: "Third Party Service Providers. Be transparent to each other!"
description: "Call to display your third party providers."
tags: "#motivation #data #opensource #communication"
image: "https://cdn-images-1.medium.com/max/1600/1*5qdXAhgCLQUv5yxL_wiDaQ.png"
canonical: "https://medium.com/@david.dalbusco/third-party-service-providers-transparency-6092764d078f"
---

![](https://cdn-images-1.medium.com/max/1600/1*5qdXAhgCLQUv5yxL_wiDaQ.png)

*Photo by [Elijah O’Donnell](https://unsplash.com/@elijahsad?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until (probably not) the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Thirteen** days left until hopefully better days.

*****

I don’t know if you share my observation but I feel like currently we have reached a point in the Coronavirus crisis where every third news is either about another [Zoom data breach](https://techcrunch.com/2020/04/01/daily-crunch-zoom-faces-security-scrutiny/) or about a new solution or application which aims to solve and improve the current situation with the help of “anonymized cell phone geolocation data” or other behavioral data.

From a personal point of view, moreover than making me aware than once again I should pay attention to these subjects, these news also reminded me something small we had put in place in [DeckDeckGo](https://deckdeckgo.com), our open source editor for presentations..

Indeed, like most of the web platforms, we do have a [privacy policy](https://deckdeckgo.com/privacy) and [terms of services](https://deckdeckgo.com/terms), like some we are also open source and all our code is available publicly on [GitHub](https://github.com/deckgo/deckdeckgo) but what we do have and, to my knowledge few also have, is a [dedicated page](https://deckdeckgo.com/services) where we summarize transparently all the third party service providers we are using to provide our solution.

It is maybe not much,  but such a page is to our eyes really worthy. No long pages to scroll, no hidden information, no tricks, no b*ullshit (excuse my french),  just one page in which you can find quickly what services and what partners are used, period.

It might not speak to everybody, I'm agree, and I don't except neither big companies to do the same as well, but if just one person would read this article, maybe implement it too or improve it with any feedback, I think that would be already a small step towards a more transparent web and that's why I am sharing the idea with you today.

*****

Here is the copy of what we are currently using respectively what we are displaying in such a page (for later reader, today is the 6th April 2020):

### Services

We aim to be transparent, therefore, furthermore than open sourcing our all code on [Github](http://github.com/deckgo/deckdeckgo), here are the list of services we are using to provide DeckDeckGo.

#### Amazon

We use AWS [Lambda](https://aws.amazon.com/lambda/), [RDS](https://aws.amazon.com/rds/), [S3](https://aws.amazon.com/s3/) and [SQS](https://aws.amazon.com/sqs/) to save and publish online the presentations as Progressive Web Apps. The choice behind this is mostly the fact that we thought that the S3 solution was a good one for our purpose but beside that, it was also challenging to run Haskell Webapps on AWS Lambda.

#### Google

We are using [Firestore](https://firebase.google.com/products/firestore/) to save your data and the presentations you are editing. We are also using Google Firebase [Hosting](https://firebase.google.com/products/hosting/) and [Authentication](https://firebase.google.com/products/auth/). Both feature are good match to serve and deploy easily Progressive Web Apps. Their Authentication is also interesting as it provides the social login we were looking for (like Email and Github).

#### Tenor and Unsplash

To provide a user friendly gifs and stock photos integration we have integrated the APIs provided by [Tenor](https://tenor.com/), which is owned by Google, and [Unsplash](https://unsplash.com/).

#### Font Awesome

The shapes, which could be integrated in your presentation, are free icons provided by [Font Awesome](https://fontawesome.com/). We do not use any APIs to fetch these respectively we are hosting them.

#### Mailchimp

In order to send time to time newsletters, mostly when we are releasing new features, we are using [Mailchimp](https://mailchimp.com/). Upon creating an account users are opted into it but they can opt out through their account’s “Settings” page and at the link of the footer in any of these non-administrativ emails.

All these services are covered in our [Privacy Policy](https://deckdeckgo.com/privacy) and [Terms of Services](https://deckdeckgo.com/terms).

*****

### Summary

Do not misunderstand me, we are using third party services,  we always apply a “privacy per default” approach but we are far away of being perfect, but at least, we always try our best and we are transparent.

Stay home, stay safe

David

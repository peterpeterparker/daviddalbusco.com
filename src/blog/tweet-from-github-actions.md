---
path: "/blog/tweet-from-github-actions"
date: "2021-03-05"
title: "Tweet From GitHub Actions"
description: "Develop a Twitter Bot that runs in GitHub Actions."
tags: "#javascript #showdev #webdev #tutorial"
image: "https://cdn-images-1.medium.com/max/1600/1*GGBgZEgWp8_bR5S2fVhybg.jpeg"
canonical: "https://daviddalbusco.medium.com/tweet-from-github-actions-e289de58988a"
---

![](https://cdn-images-1.medium.com/max/1600/1*GGBgZEgWp8_bR5S2fVhybg.jpeg)

_Photo by [Ravi Sharma](https://unsplash.com/@ravinepz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I launched recently [DiscoverWeekly.dev](https://discoverweekly.dev/) a website that shares each Wednesday the new music playlists made by the developers.

To spread the information and let people subscribe, in addition to a RSS feed, I opened a [Twitter](https://twitter.com/discoverweekly_) account and developed a Bot which tweets once a week about the news playlists as well.

Here is how you can also create a Twitter Bot that runs periodically in GitHub Actions.

---

### Twitter API

Tweets are posted with the help of the Twitter API. To get access to such a feature, you need to create a developer account and request access. You can start your application [here](https://developer.twitter.com/en/apply-for-access).

The process takes several steps but, overall, can be solved in a couple of minutes.

Once you get access to your [Dashboard](https://developer.twitter.com/en/portal/dashboard), create a new project.

![](https://cdn-images-1.medium.com/max/1600/1*d7T5ulDZCk5AbJD5Qrwz-A.png)

In your “App permissions”, request the “Read and Write” permissions.

![](https://cdn-images-1.medium.com/max/1600/1*NWATz8Zlxx3CgNZMmBvRVQ.png)

Finally, under “Keys and Tokens”, generate all “Access token & secret”.

![](https://cdn-images-1.medium.com/max/1600/1*axwweoz1kGPPaZW-I5h6Lg.png)

Note that if you have generated your secrets before requesting the "read & write" permission, you have to regenerate your secrets.

---

### Library

Even though consuming the Twitter API does not look like rocket science, using an already well made Node.js library ease the process. In addition, Twitter is currently developing a new API (v2) but, the one we are looking to use, [statuses/update](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update), is not yet migrated (v1). Therefore, using a library as an extra layout might help us in that case not to have to rewrite everything in the future.

That is why we are adding the [twitter-api-client](https://github.com/FeedHive/twitter-api-client) library to our project.

```bash
npm i twitter-api-client --save-dev
```

---

### Twitter Bot

To develop the Twitter Bot, we create a new file `twitter.js` at the root of our project. It contains a function which takes care of the `tweet` itself, using the `twitter-api-client` , and a top level `async` block which triggers it when the script is run.

In order to not expose publicly the tokens we have created previously, we are accessing these through environments variables (see next chapter).

Finally, in following example, the tweet is a constant message. As any tweet, should be maximal 280 characters long, can tag usernames and point to Url.

```javascript
const { TwitterClient } = require("twitter-api-client");

const tweet = async (status) => {
	const twitterClient = new TwitterClient({
		apiKey: process.env.TWITTER_API_KEY,
		apiSecret: process.env.TWITTER_API_SECRET,
		accessToken: process.env.TWITTER_API_ACCESS_TOKEN,
		accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	});

	await twitterClient.tweets.statusesUpdate({ status });
};

(async () => {
	try {
		const myTweet = `Checkout @discoverweekly_ https://discoverweekly.dev`;

		await tweet(myTweet);
	} catch (err) {
		console.error(err);
	}
})();
```

To run the Bot, we add a related `scripts` target in our `package.json` .

```json
"scripts": {
  "twitter": "node ./twitter.js"
},
```

---

### Environment Variables

To make our tokens and secrets, we are handling through environment variables, available to our GitHub Actions, go to your `GitHub repo > Settings > Secrets` and add these with their respective values.

![](https://cdn-images-1.medium.com/max/1600/1*p_SW7X4ifZ0tiONf0PsEDA.png)

---

### GitHub Actions

Finally, add a GitHub Actions such as `.github/workflows/twitter.yml` to your project which run the Node.js script we created before periodically.

In my case, as I publish once a week new playlists and tweet about these only once too, the workflow is [scheduled](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#schedule) to run at specific UTC times.

```yaml
name: Twitter bot

on:
  schedule:
    - cron: "0 15 * * 3"

jobs:
  build:
    name: Tweet about the new playlists
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@master
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: "14.x"
      - name: Install Dependencies
        run: npm ci
      - name: Run Twitter bot
        run: npm run twitter
        env:
          TWITTER_API_KEY: ${{ secrets.TWITTER_API_KEY }}
          TWITTER_API_SECRET: ${{ secrets.TWITTER_API_SECRET }}
          TWITTER_API_ACCESS_TOKEN: ${{ secrets.TWITTER_API_ACCESS_TOKEN }}
          TWITTER_ACCESS_TOKEN_SECRET: ${{ secrets.TWITTER_ACCESS_TOKEN_SECRET }}
```

---

### Summary

![](https://cdn-images-1.medium.com/max/1600/1*N4H7Sfn1DEt9XJWQ3PnnEA.gif)

I was surprised to notice how straight forward it was to develop such a Twitter Bot and it was actually kind of fun. I hope this article will help you too.

To infinity and beyond!

David

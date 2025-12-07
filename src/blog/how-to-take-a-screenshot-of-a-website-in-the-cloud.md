---
path: "/blog/how-to-take-a-screenshot-of-a-website-in-the-cloud"
date: "2019-07-20"
title: "How to take a screenshot of a website in the cloud"
description: "How to take a screenshot of a website in the cloud using Puppeteer in a Google Firebase Functions and to save the results to Google Firebase Storage"
tags: "#javascript #webdev #tutorial #programming"
image: "https://daviddalbusco.com/assets/images/1*0cBVakg6yb906eFR0VLm8Q.jpeg"
---

![](https://thepracticaldev.s3.amazonaws.com/i/nsa5dduag5csoamhu28o.jpg)

_Photo by [samsommer](https://unsplash.com/@samsomfotos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

We are currently [developing](https://daviddalbusco.com/blog/we-are-developing-an-open-source-editor-for-presentations) an open source web editor for presentations called [DeckDeckGo] which, hopefully, we will be able to release in beta around the end of the summer (🤞).

Why I allowed my self to be so frontal in my opening sentence? Well, here we go: I'm happy to officially announce that it will not "just" be an editor but that we also designed it to be an online platform where presentations will be shared and ultimately, if I let my self dream a bit about the future, will be indexed according your interests and maybe will be even discussed.

We are far, far away of such an application and community but it does not mean we can't dream a bit, specially as the project is a side one which we implement at nights and on the weekends for fun. Therefore we have decided to already implement the first piece of this idea in our beta. The main screen, which I call the "feed", will present all the decks which are going to be edited and published (as standalone Progressive Web Apps…but that's another story 😉) with our tool. For that purpose, as for their social cards, we had the need, or we decided, to capture in the cloud a screenshot of the first slide of such decks and that's why I'm writing this new blog post to display how you could create a [Google Functions for Firebase](https://firebase.google.com/docs/functions) to take a screenshot of a website in the cloud 📸

![](https://thepracticaldev.s3.amazonaws.com/i/o9122u7ms0zku9xcevo1.gif)

_A sneak peek of our feed filled with our test presentations_

# Introduction of the solution

As introduced above, for this solution, we are going to write a new Google Functions for Firebase in order to run our process in the cloud. For the particular case of the screenshot, we are going to use [Puppeteer](https://github.com/GoogleChrome/puppeteer). We are going to use it to run a headless Chrome, where we are going to load the website, and to take the screenshot too. Finally we are going to write the results in [Google Firebase Storage](https://firebase.google.com/docs/storage).

# Before we start

To be honest, as always, Google published a really well written article in August 2018 which introduces the [headless Chrome support in Cloud Functions and App Engine](https://cloud.google.com/blog/products/gcp/introducing-headless-chrome-support-in-cloud-functions-and-app-engine) which exactly displays how to take a screenshot. In comparison to this article, this post introduces the storage but also improves a bit the way of capturing the screenshot, so I hope you still do think it deserves a read and even your time 🙏

_In this "tutorial" I am going to skip the part where you setup and interact with your [Google Firebase Functions](https://firebase.google.com/docs/functions) or Storage, there are dozen of documentations and tutorials about it and, furthermore, the Google Firebase Console even provides wizards to drive you through all these process. You could also note that I use [TypeScript](https://firebase.google.com/docs/functions/typescript) to write the functions and we are going to write all our code in the main file_ `src/index.ts`.

# Getting started

For the purpose of this article we are going to create an [HTTP functions](https://firebase.google.com/docs/functions/http-events) which could be, obviously, invoked through HTTP. In the particular case of DeckDeckGo, we are using a [realtime database triggers](https://firebase.google.com/docs/functions/database-events) to trigger the process. Therefore, just in case you would ask yourself, yes, regardless of the trigger, such a solution could be implemented.

```
import * as functions from 'firebase-functions';

export const takeScreenshot =
             functions.https.onRequest(takeScreenShotOnRequest);

async function takeScreenShotOnRequest(request, response) {
    // 1. Generate screenshot
    // 2. Save to the storage
}
```

# Take the screenshot

As explained above, we are going to use Puppeteer to capture the screenshot, therefore, first things first, we have to install the dependency and its type definition for typescript:

```
$ npm install puppeteer --save
$ npm install @types/puppeteer --save-dev
```

Once installed, we could now modify our previous code and implement our function:

```
import * as functions from 'firebase-functions';
import * as puppeteer from 'puppeteer';

export const takeScreenshot =
             functions.https.onRequest(takeScreenShotOnRequest);

async function takeScreenShotOnRequest(request, response) {
    try {
        const imageBuffer: string = await generateScreenShot();

        // 2. Save to the storage
    } catch (err) {
        console.error(err);
    }
}

function generateScreenShot(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        try {
            const browser =
                  await puppeteer.launch({args: ['--no-sandbox']});

            const page = await browser.newPage();

            // Screenshot size
            await page.setViewport({width: 1024, height: 576});

            // Go to your website
            await page.goto('https://deckdeckgo.com');

            // Disable service workers
            await (page as any)._client
                  .send('ServiceWorker.enable');
            await (page as any)._client
                  .send('ServiceWorker.stopAllWorkers');

            // Wait for a particular components to be loaded
            await page
                  .waitForFunction('document.querySelector("deckgo-deck  > *")');

            // Take the screenshot
            const imageBuffer: string = await page.screenshot();

            await browser.close();

            resolve(imageBuffer);
        } catch (err) {
            reject(err);
        }
    });
}
```

What's happening there 🤔? We are telling Puppeteer to run a headless Chrome where we access our website in a page with a specific size which ultimately will be the size (width and height) of our screenshot. Moreover, we are disabling the service workers ("no cache = always fresh data") and are also waiting for a particular element to be loaded before taking the screenshot. If your goal is to take a screenshot from a static website, of course you could step that particular step. Finally, we are telling Puppeteer to take a screenshot and we are returning the image buffer as result of the function.

## Special credits

I did not came to that really neat solution alone. It is actually the result of an exchange with Matthias Max, CEO of [bitflower](https://www.bitflower.net/), on the [StencilJS Slack](https://stencil-worldwide.herokuapp.com/) channel. Kudos to him, I would for example not have seriously thought in a first place on disabling the service workers if he would not have shared his idea and code, thanks a lot Matthias 👍

## Tips and tricks

In case you would need more memory to run your cloud function (it was the case for our project), you could extend the above declaration with, for example, 1GB of memory and a timeout of 2 minutes.

```
const runtimeOpts = {
    timeoutSeconds: 120,
    memory: <const> '1GB'
};

export const takeScreenshot =
                 functions.runWith(runtimeOpts)
                 .https.onRequest(takeScreenShotOnRequest);
```

# Save to the storage

Saving the image buffer to the storage is actually, don't know why I'm still surprised by the simplicity of Google Firebase, really easy. Using the Firebase Admin we just need to reference the default bucket, create a file object and saves it, nothing more, nothing left.

Nota bene: no need to check or create specific folders and subfolders, the library handles everything for you. Also if you would run the process multiple times, per default, the resulting file in the storage are just going to be overwritten.

```
import * as functions from 'firebase-functions';

import * as puppeteer from 'puppeteer';

import * as admin from 'firebase-admin';

export const takeScreenshot =
             functions.https.onRequest(takeScreenShotOnRequest);

async function takeScreenShotOnRequest(request, response) {
    try {
        const imageBuffer: string = await generateScreenShot();
        await saveScreenShot(imageBuffer);
    } catch (err) {
        console.error(err);
    }
}
function generateScreenShot(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        try {
            // Replace with the same code as in previous chapter

            resolve(imageBuffer);
        } catch (err) {
            reject(err);
        }
    });
}

function saveScreenShot(imageBuffer: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        if (!imageBuffer || imageBuffer === '') {
            reject('No screenshot');
            return;
        }

        try {
            // We get the instance of our default bucket
            const bucket = admin.storage().bucket();

            // Create a file object
            const file = bucket.file(`/screenshots/deckdeckgo.png`);

            // Save the image
            await file.save(imageBuffer);

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}
```

That's it, we have implemented a Google Cloud Function to take and save a screenshot of our website 🎉

# Trying it out

As I said above, I won't go in the details of the interaction with Firebase. That being said, you could deploy your function running the following command in a terminal:

```
$ firebase deploy
```

And you could also try it out running the following curl command in your terminal too:

```
$ curl -i -H "Accept: application/json" -X GET  https://us-central1-your-cool-app.cloudfunctions.net/takeScreenshot
```

_Replace `https://us-central1-your-cool-app.cloundfuntions.net` with your application/functions URL._

# Cherry on the cake 🍒🎂

Our project is open source and we try to encourage others to do so too, that's why we released this particular function in our monorepo under the [GNU Affero General Public License](https://en.wikipedia.org/wiki/GNU_Affero_General_Public_License). Therefore if your project is cool too (😉) be our guest and clone:

`https://github.com/deckgo/deckdeckgo/tree/master/cloud`.

To infinity and beyond 🚀
David

[DeckDeckGo]: https://deckdeckgo.com

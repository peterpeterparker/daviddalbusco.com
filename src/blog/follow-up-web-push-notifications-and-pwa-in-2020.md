---
path: "/blog/follow-up-web-push-notifications-and-pwa-in-2020"
date: "2020-04-14"
title: "Follow-up: Web Push Notifications And PWA In2020"
description: "A follow-up to my one year old tutorial Web Push Notifications In Progressive Web Apps with Ionic AndAngular"
tags: "#javascript #ios #android #angular"
image: "https://cdn-images-1.medium.com/max/1600/1*W6Eot89ZwJa994WQum55Sg.png"
canonical: "https://medium.com/@david.dalbusco/follow-up-web-push-notifications-and-pwa-in-2020-54d27fbc829a"
---

![](https://cdn-images-1.medium.com/max/1600/1*W6Eot89ZwJa994WQum55Sg.png)

*Photo by [Javier Allegue Barros](https://unsplash.com/@soymeraki?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://medium.com/@david.dalbusco/one-trick-a-day-d-34-469a0336a07e) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Five** days left until this first milestone. Hopefully better days are ahead.

*****

If you follow me on [Twitter](https://twitter.com/daviddalbusco), you may have read that an application I developed and recently submitted to the stores have been rejected by both Apple and Google because it was not aligned, according them, with their restrictive policy regarding the current COVID-19 pandemic.

I am not writing these lines to share my opinion on these companies, but to share a follow-up to my one year old tutorial: [Web Push Notifications in Progressive Web Apps](https://medium.com/@david.dalbusco/add-web-push-notifications-to-your-ionic-pwa-358f6ec53c6f).

Indeed one core concept of the app which was rejected relies on Push Notifications. As it is developed with [Ionic](https://ionicframework.com) and [Angular](https://angular.io), we are able to unleash a Progressive Web Apps, but is such feature yet well supported?

*****

### Introduction

I am writing this article **Tuesday 14th April 2020**, that’s why it reflects the status of that specific date. If you would read this in the future and notice improvements or changes, ping me!

This afternoon I ran my tests on my Android phone, a OnePlus 6 running Android v10 and on my iPhone 6s running iOS 13.

*****

### Android

It works like a charm, period. I tested Web Push Notifications with my phone in idle mode, awake and with the application open. In all cases, I received the notifications. Great work Google 👍.

*****

### iOS

Web Push Notifications are still **not supported** on iOS. The status didn’t change since I published my tutorial in February 2019. As you can notice with the help of [Caniuse](https://caniuse.com/#search=notification), the Notifications API is not yet implemented by iOS Safari.

*****

### Setup

The [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) set up I displayed in my previous article still remains valid. Of course maybe some screenshots have changed or have been actualized, but the idea remains the same. Moreover, I have set up the tokens for my application in the exact same way and everything went fine.

An interesting thing to notice though, it the [comment](https://medium.com/@galilo7g/good-tutorial-just-mention-the-need-to-specify-the-firebase-version-in-the-service-worker-that-e90d3d8a2231) from [Galilo Galilo](https://medium.com/@galilo7g). According his/her experience, the Firebase dependencies used in the service worker had to be set as the exact same version number as the one used in `package.json` . I did not had this problem but it is something which might be worth to keep in mind.

*****

### Implementation

To the exception of the following deprecation, which can or not be improved, the [implementation](https://medium.com/@david.dalbusco/deeplinking-in-ionic-apps-with-branch-io-ba1a1c4ed227) displayed in my previous tutorial remains also valid. It is the one I have implemented in our application and therefor the one I successfully tested today on my Android phone.

That being said, I think that there might be an easier way, specially if you are using [AngularFire](https://github.com/angular/angularfire), to implement Web Push Notifications in a Progressive Web Apps. I did not check it out but before following my tutorial it maybe deserves a quick research, just in case you would be able to spare some time 😉.

*****

#### Deprecation

Not a big deal but while having a look at the code I noticed that `await messaging.requestPermission();` was marked as deprecated. It can be updated as following:

```javascript
if (Notification.permission !== 'denied') {
    await Notification.requestPermission();
}
```

*****

#### Altogether

Altogether, my enhanced Angular service which takes care of registering the Web Push Notifications and requesting the permissions.

```javascript
import {Injectable} from '@angular/core';

import {firebase} from '@firebase/app';
import '@firebase/messaging';

import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseNotificationsPwaService {

    async init() {
        navigator.serviceWorker.ready.then((registration) => {
            if (!firebase.messaging.isSupported()) {
                return;
            }

            const messaging = firebase.messaging();

            messaging.useServiceWorker(registration);

             messaging
                 .usePublicVapidKey(environment.firebase.vapidKey);

            messaging.onMessage((payload) => {
                // If we want to display 
                // a msg when the app is in foreground
                console.log(payload);
            });

            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                    (refreshedToken: string) => {
                    console.log(refreshedToken);
                }).catch((err) => {
                    console.error(err);
                });
            });
        }, (err) => {
            console.error(err);
        });
    }

    async requestPermission() {
        if (!Notification) {
            return;
        }

        if (!firebase.messaging.isSupported()) {
            return;
        }

        try {
            const messaging = firebase.messaging();

            if (Notification.permission !== 'denied') {
                await Notification.requestPermission();
            }

            const token: string = await messaging.getToken();

            // User token
            console.log(token);
        } catch (err) {
            console.error(err);
        }
    }
}
```

*****

### Summary

Hopefully one day we will be able to send Web Push Notifications on iOS devices too 🤞.

Stay home, stay safe!

David

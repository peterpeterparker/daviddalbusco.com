---
path: "/blog/add-web-push-notifications-to-your-ionic-pwa"
date: "2019-02-22"
title: "Add Web Push Notifications to your Ionic PWA"
description: "Add Web Push Notifications to your Ionic Angular PWA using Google FCM"
tags: "#ionic #angular #firebase #javascript"
image: "https://daviddalbusco.com/assets/images/1*zZyMLQSqP8VZsi-ptOgLSw.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*zZyMLQSqP8VZsi-ptOgLSw.jpeg)

I volunteered to showcase to our [Ionic Zürich Meetup](https://www.meetup.com/fr-FR/Ionic-Zurich/) community the implementation of Web Push Notifications, using [Google FCM](https://firebase.google.com/docs/cloud-messaging/), in a Progressive Web App developed with [Ionic ](https://ionicframework.com/) and [Angular](https://angular.io/). Although the [set up guide](https://firebase.google.com/docs/cloud-messaging/js/client) provided by Google is relatively clear, I thought it might be a good idea to write a new article, in form of a step by step tutorial, about that particular topic (specially to help me not forget something 😅).

_For the purpose of this article I assume that you already have an `@ionic/angular` application. If not, you could start a new project running the following command in a terminal:_

```
ionic start --type=angular
```

_I will also assume that your application is already a Progressive Web App, if
not have a look to the Angular [documentation](https://angular.io/guide/service-worker-getting-started) to get to know how to add that support to your project or run the following command in your freshly created new Ionic project:_

```
ng add @angular/pwa — project app
```

### Spoiler alert ⚠️

Let’s make that straight clear from the begin, Web Push Notifications, at least when I’m writing these lines the 16th February 2019, [isn’t supported by iOS](https://caniuse.com/#search=notification).

Furthermore, as we are looking to implement Web Push Notifications in a Progressive Web App, we might be interested to push notifications to a mobile devices. Therefore, it’s also worth to notice, that as far as I tested recently, such notifications will not be triggered on the devices if the application is completely closed on Android devices. Regardless of the device status, lock or unlocked, notifications will only be triggered (“will ring the bell”) as long as the application is in foreground or background, but it might deserve further tries.

That being said, let’s start by setting up Firebase and its Cloud Messaging solution.

### Configure Firebase in your project

If you are already using Google Firebase in your project, skip this chapter. If you don’t, first add the firebase libraries to your Angular application using the following command line:

```
npm install firebase --save
```

Once done, go to you Firebase console to retrieve your configuration and copy the properties.

![](https://daviddalbusco.com/assets/images/1*pY72dn5n0tPtKvuCEqlWRQ.png)
<span class="figcaption_hack">Click the “</>” button to discover your configuration</span>

![](https://daviddalbusco.com/assets/images/1*sHKB6IeYW956WXKj_k_2Hw.png)
<span class="figcaption_hack">Copy the JSON properties</span>

Once copied, add these information to the environment of your project, for example in your `environment.ts` file.

```
export const environment = {
  production: false,
  firebase: {
    apiKey: 'API_KEY',
    authDomain: 'AUTH_DOMAIN',
    databaseURL: 'https://PROJECT.firebaseio.com',
    projectId: 'PROJECT_ID',
    storageBucket: 'PROJECT.appspot.com',
    messagingSenderId: 'MSG_SENDER_ID'
  }
};
```

Finally initialize Firebase in your application’s startup, for example in your `app.component.ts` file.

```
import {firebase} from '@firebase/app';
import {environment} from '../environments/environment';
async ngOnInit() {
    firebase.initializeApp(environment.firebase);
}
```

_Note: pay attention to the import of Firebase. If you are using an editor which add automatically the import, it might resolves _`import * as firebase from 'firebase'`_ instead of _`import {firebase} from '@firebase/app'`_ which would lead to loading all the libraries, which obviously we don’t want. Furthermore, if you do so, the library itself will displays a warning in the console to ask you to correct the import for production._

### Configure Google Fire Cloud Messaging

In order to be able to push Web Push Notifications with FCM, you will need a Web Credential called “Voluntary Application Server Identification” or “VAPID” key. To tell your application to subscribe to the notifications, you will need to associate such a key with your project.

To generate a new key, open the [Cloud Messaging] (https://console.firebase.google.com/project/_/settings/cloudmessaging/) tab of your Firebase console **Settings** pane and scroll to the **Web configuration** section.

![](https://daviddalbusco.com/assets/images/1*vIPfMFcKbvEUYIXZw84c4g.png)
<span class="figcaption_hack">Generate a VAPID key pair in your Firebase Console (Tab “Settings > Cloud
Messaging”)</span>

### Configure your PWA for FCM

Once the previous VAPID key generated, you will have to add it to your project. I would suggest to add it to the other Firebase properties respectively to your file `environment.ts` file like the following:

```
export const environment = {
    ...
    firebase: {
        ...
        vapidKey: 'VAPID_KEY_WE_GENERATED'
    }
};
```

Finally, to authorize Google FCM to send messages to your application, you will need to add first a **fixed** value to the Web App Manifest (`manifest.json` or other `manifest.webmanifest`) file of your project.

_Yes this value is the same for every single apps in the world, it identifies Google FCM as sender of the notifications._

```
{
    "gcm_sender_id": "103953800507"
}
```

### **Before coding**

As we are implementing this solution in a Progressive Web App, before beginning to code, I think it’s important to briefly summarize which layer of your application will be responsible for doing what. It may sound clear for you but I’m not ashamed to admit that it took me a while to get it 😅

#### Service Worker

The Service Worker is responsible to receive or listen to messages when the application is in the background or close. Therefore we have to initialize Firebase in a Service Worker script and listen for new messages.

It’s also worth to notice, if I understood correctly, that we have to reference the Firebase libraries in the Service Worker scripts as the worker is separated of the bundle and therefore don’t have access to the vendor libraries packaged in your application.

#### Application

The application, “your Angular code”, is in charge of registering the VAPID key and asking the users for their permissions to send notifications or not. These two goals are a must to achieve our goal.

If you want to go deeper, then you could also add to your application layer a listener to receive new messages, in case you would like to display them differently when the application is in the foreground, and you would have to take care of saving and refreshing the users tokens too.

### Hands-on

Let’s begin the implementation with the Service Worker layer followed by the application itself.

#### Service Worker

As described in the Firebase [documentation](https://firebase.google.com/docs/cloud-messaging/js/receive) you should create a new `firebase-messaging-sw.js` in your `src` folder. I would suggest not to use another name as, I think, Firebase is also explicitly looking for that filename when subscribing for new messages.

Before implementing its content, you will have first to add this file to the list of `assets` of your `angular.json` otherwise it will not be bundled with your application.

```
"assets": [
     "src/firebase-messaging-sw.js"
]
```

Once done, you could now add its implementation. As you could notice, nothing crazy, we just load the Firebase scripts for the Service Worker, initialize and add a listener for the messages, that’s it.

```
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.3/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: 'YOUR_SENDER_ID'
});

const messaging = firebase.messaging();
```

To find your sender ID, you could go back to your Firebase console, you should find it again under the Tab “Settings > Cloud Messaging”.

![](https://daviddalbusco.com/assets/images/1*FJNN0xRb3HVwqfTT8Va-1w.png)
<span class="figcaption_hack">Find your Firebase Sender ID (Tab Tab “Settings > Cloud Messaging”)</span>

### Application

For a relatively clean implementation, I suggest to create a new service to implement the features.

```
ionic g service notifications
```

#### Initialization

Here is maybe the tricky part of the solution. Actually it isn’t really tricky, it is just one line of code but it took me way to long to solve it. As we are building a PWA using Ionic and Angular, we are already most probably using `@angular/pwa` which takes care at bundle time to generate dynamically a Service Worker for your application. Therefore you could ask your self, at least I did, how to concatenate this dynamic worker with the worker we just created, the `firebase-messaging-sw.js` file? I found different solutions but I think that the easiest one is just to register the worker using the method `userServiceWorker()` provided by Firebase. This function will take care of adding your Web Push Notifications Service Worker at runtime to the worker of your application. Worth to notice that this has to be done when the Service Worker is ready.

Furthermore, as explained above, the other important part of the solution is the initialization of the VAPID key.

```
import {Injectable} from '@angular/core';
import {firebase} from '@firebase/app';
import '@firebase/messaging';
import {environment} from '../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        navigator.serviceWorker.ready.then((registration) => {
            // Don't crash an error if messaging not supported
            if (!firebase.messaging.isSupported()) {
                   resolve();
                   return;
            }

            const messaging = firebase.messaging();

            // Register the Service Worker
            messaging.useServiceWorker(registration);

            // Initialize your VAPI key
            messaging.usePublicVapidKey(
                  environment.firebase.vapidKey
            );

            // Optional and not covered in the article
            // Listen to messages when your app is in the foreground
            messaging.onMessage((payload) => {
                console.log(payload);
            });
            // Optional and not covered in the article
            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                (refreshedToken: string) => {
                    console.log(refreshedToken);
                }).catch((err) => {
                    console.error(err);
                });
            });

            resolve();
        }, (err) => {
            reject(err);
        });
    });
  }
}
```

The above method is an initialization function and therefore I suggest to consume it when your application is starting just after the initialization of Firebase in your `app.component.ts` file:

```
async ngOnInit() {
    firebase.initializeApp(environment.firebase);
    await this.notificationsService.init();
}
```

#### Request permissions

Obviously you can’t push notifications to a user who would not like to receive such messages. To request his/her agreement you will have then to implement a method which takes care of requesting such permissions. Once a user would have granted them, you will be able to retrieve his/her unique token which you could use later to send the notifications. To the above service you will have to add the following method for that purpose.

In addition, as [Web Notifications](https://caniuse.com/#search=notifications) or FCM messaging aren’t supported by all browsers, the method should contains a couple of tests in order to requests the permissions only if it’s possible.

```
requestPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => {
        if (!Notification) {
            resolve();
            return;
        }
        if (!firebase.messaging.isSupported()) {
            resolve();
            return;
        }
        try {
            const messaging = firebase.messaging();
            await messaging.requestPermission();

            const token: string = await messaging.getToken();

            console.log('User notifications token:', token);
        } catch (err) {
            // No notifications granted
        }

        resolve();
    });
}
```

The above method is an initialization function which need a user interaction and therefore I suggest to consume it when your application is started, for example calling it after the initialization in your `app.component.ts` :

```
ngAfterViewInit() {
     this.platform.ready().then(async () => {
        await this.notificationsService.requestPermission();
     });
}
```

That’s it, we have registered a Service Worker listener and initialized all we need in the application layer respectively you implemented the very basic needed to implement a Web Push Notifications solution using Google Firebase Cloud Messaging in a PWA build with Ionic and Angular 🎉

### Build and deploy

If I understand correctly the solution we have implemented will only work if serve over https, that’s why we are going to build the application and deploys to a web server.

To build the application, run the following command in your terminal:

```
ionic build --prod
```

_Note that we are running the command with the option _`--prod`_ as per default the service worker will only be included in your application by the Angular CLI in case of that production build._

Once built, if you already have your hosting solution, just drop the content of the `www` folder of your application on your web server. If not, I would then suggest you to use the [Google Firebase Hosting] (https://console.firebase.google.com/project/web-push-notifications-medium/hosting) solution as we are already using their solution for the purpose of this tutorial. If you never used before such a solution, just go back to your Firebase console and click “Get started” in the menu “Hosting”.

![](https://daviddalbusco.com/assets/images/1*z56WG_qUcxg_LMfJN7--CQ.png)
<span class="figcaption_hack">Initialize a Google Firebase Hosting</span>

I will not cover further all the steps to initialize and deploy your application to a Firebase hosting as Google do a great job at guiding you though these steps, therefore, I assume that if you are reaching that point you have now deployed your application to a web server which serve your application though https.

### Test locally

Now that your application is up and running, you could access it through the url provided by Firebase or your own hosting url. If everything works according plan, just after you accessed your application, it should ask you if you wish or not to receive notifications.

_Worth to notice, if you are using Google Chrome, don’t try out your application with a private tab or private window as Chrome block these kind of notifications in such tabs or windows. Just use a regular tab or window._

![](https://daviddalbusco.com/assets/images/1*7rDw7XpG4xF2UCp0e6C0hA.png)
<span class="figcaption_hack">Do you want to receive notifications?</span>

Of course please, for the purpose of this tutorial authorize the notifications 😉 Once granted, open your browser’s debug console to find out your user’s notification token (in the above method `requestPermission` you have added a `console.log` to retrieve this information).

![](https://daviddalbusco.com/assets/images/1*M2w1xm9QC6NaHaCggN2t7A.png)
<span class="figcaption_hack">Retrieve the user’s notification token</span>

Now that you know to whom we are going to send a notification, we could prepare a notification. Google Firebase Cloud Messaging support [message requests thought http](https://firebase.google.com/docs/cloud-messaging/send-message), meaning that we could send an http request to a Google API server containing the message and its payload which will then be delivered to the user we are specifying in the message.

For the purpose of this tutorial we are going to use cURL and we are going to send the following request:

```
curl -X POST -H "Authorization: key=SERVER_KEY" -H "Content-Type: application/json" -d '{
"notification": {
    "title": "Web Push Notifications",
    "body": "Hey, Hello World",
    "click_action": "https://mywebsite.ccom"
},
"to": "USER_TOKEN"
}' "https://fcm.googleapis.com/fcm/send"
```

The request will contain a payload in form of a title, body and an action for the click on the notifications. It will contains the user’s token, which we retrieved above, and will also need the server key, as the message has to be authenticated. To retrieve that key, go back to your Firebase console under tab “[Cloud
Messaging](https://console.firebase.google.com/project/web-push-notifications-medium/settings/cloudmessaging/)”:

![](https://daviddalbusco.com/assets/images/1*EOsY6NlSfDaoRtydBb_XEw.png)
<span class="figcaption_hack">Find your server key</span>

Once you have replaced the user’s token and server key in the above message, remove its line break respectively join the lines of the message in order to have one single line and execute as a command in a terminal and the magic should finally happens 🎉

![](https://daviddalbusco.com/assets/images/1*c3Jd8c2H9l2UXA83ARctrA.png)

_Worth to notice, if your application is active or in foreground, at least when I tested on my Macbook OSX Mojave, no notification will pop up. For the purpose of this test, I suggest you to reduce your browser windows._

### Test on mobile devices

Finally we are reaching the last test of this tutorial 😅 As we are looking to implement Web Push Notifications in a Progressive Web App and as we have deployed your application on a web server, it’s time to test it on your mobile device.

To reproduce what would a user would do, I suggest to access the PWA, accept the notifications and then add the application to the home screen.

![](https://daviddalbusco.com/assets/images/1*8dSbEqS6YeCdvntWYdaZDw.jpeg)
<span class="figcaption_hack">“Install” the PWA on your phone and accept the notifications</span>

Now that the application is installed, we have to retrieve the user’s token. Again we are going to open the browser’s debug to find this in the console output.

_If you never done that before, pair your phone to your computer with a cable an open the “Remote devices” tab in Google Chrome._

![](https://daviddalbusco.com/assets/images/1*j6jT3YwhI7k5bIH_LPQ-zA.png)
<span class="figcaption_hack">Open “Remote devices”</span>

![](https://daviddalbusco.com/assets/images/1*pz3ynVE1mQ8d81V9yZvCrg.png)
<span class="figcaption_hack">Find the users’ token</span>

Finally, to run the final test, I suggest you to lock your phone and once done to run again a cURL request in your command line to target this new user’s token. If everything goes well you should have now received a Web Push Notifications which should have ring the bell of your phone and wish should appears on your lock screen 🎉

![](https://daviddalbusco.com/assets/images/1*1wKpJSGaVIypHx2Ws7BsCw.jpeg)
<span class="figcaption_hack">The Web Push Notifications shimming on my lock screen</span>

### Summary

I hope that you are still here to read these last lines as I kind of feel that this solution and tutorial needed probably too much steps. On the other hand, when we think about it, the solution was relatively easy to implement and it’s kind of cool to notice that it is possible to send push notifications through the web and I’m definitely looking forward to the day where this standard will be implemented on every platforms and browsers.

To infinity and beyond 🚀

David

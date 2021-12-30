---
path: "/blog/deeplinking-in-ionic-apps-with-branch-io"
date: "2020-04-13"
title: "Deeplinking in Ionic Apps With Branch.io"
description: "How to set up deep links for your Ionic Apps with Branch.io and intercept parameters"
tags: "#showdev #webdev #ionic #mobile"
image: "https://cdn-images-1.medium.com/max/1600/1*AbG39baPvtxSgOoSjWgHqg.png"
canonical: "https://medium.com/@david.dalbusco/deeplinking-in-ionic-apps-with-branch-io-ba1a1c4ed227"
---

![](https://cdn-images-1.medium.com/max/1600/1*AbG39baPvtxSgOoSjWgHqg.png)

*Photo by [Javier Allegue Barros](https://unsplash.com/@soymeraki?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the original scheduled date of the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Six** days left until this first milestone. Hopefully better days are ahead.

*****

Last Friday I had to quickly implement the deeplinking support for an application that we were finalizing. Its goals was, and still is, to help isolated people to feel less alone to find out easily for help within their relatives, something really useful in normal times, specially for older people we think, but maybe even more when there is a crisis.

Turns out the Apple  rejected it on Saturday as they think that our project is only COVID-19 focused and only accept related projects from certified organizations 😢. If interested, CNBC published an article about the [subject](https://www.cnbc.com/2020/03/05/apple-rejects-coronavirus-apps-that-arent-from-health-organizations.html).

Anyway, not here to share my opinion on companies which became more powerful than states and their people but here to share technical tips and tricks 😉.

That’s why here is how I implemented quickly such a concept including how to catch linked parameters.

*****

### What’s Deeplinking?

To me deeplinking solve miscellaneous problematics linked to mobile applications:

1. An app can be available in the App Store, Google Play, as a Progressive Web Apps and probably even in other stores. For all of them, it will be accessible with the help of a different link or URI, therefor, it makes your communication a bit difficult as you have to communicate multiple links (“If you are using Android, click here. If you are using iOS, click here. Etc.). Thanks to deep links it is possible to provide one single URL which link the user to the appropriate resource, appropriate target.

2. Users may have or not already installed you application. That’s why, when you provide them a link, you might want to link them either straight to it, if already installed, or automatically to the store if they don’t have it yet installed.

3. Finally, you might have to provide parameters to your application. What would happen if a user click a link, does not have the application, goes to the store, install the application and then start it? The parameters would be lost. That is also were deep linking can help to maintain and provide the parameters until the user effectively start the application.

*****

### Deeplinking Vs Custom URI Scheme

Deeplinking should not be confused with a custom URI scheme.

A custom URI scheme, for example `myapp://` , is a scheme which can be handle on the mobile devices to call your application **but** this works only once the application has been installed. Before that point, the devices has no idea of such scheme.

*****

### Branch.io

I generally don’t write about none open source solutions but so far, I did not found better solution than [Branch.io](https://branch.io) to setup deep links.

There is a [Cordova Ionic plugin](https://github.com/ionic-team/ionic-plugin-deeplinks) to handle such links which is maintained by the community. When [Ionic](https://ionicframework.com) introduced it some years ago I used it at first but finally went for the Branch solution but to be honest I don’t remember exactly why, probably a specific case.

Branch has a starter free plan.

*****

### Setup

Branch provide a comprehensive [documentation](https://help.branch.io/developers-hub/docs/cordova-phonegap-ionic) about how to configure their services and even their platform, once you are registered, is pretty straight forward to be used.

Only important things worth to notice: your application **has to be available in store** before being able to properly setup deep links. When you configure it, you will have to search it and link it with your account, therefor it has to be public and available first, otherwise you won’t be able to finish the configuration.

But, worth to notice, that you don’t have to wait for publishing to already implement and test it.

*****

### That’s It

That’s already it! If you only goal is to provide deep links to our, current and potential, users which point either to your app if installed or to the store with a single link, you are done.

No need to install a plugin, regardless if you are using [Cordova](https://cordova.apache.org) or [Capacitor](https://capacitor.ionicframework.com).

For example, check out the source code of my app Tie Tracker on [GitHub](https://github.com/peterpeterparker/tietracker). As you notice, there isn’t any references to Branch but even though, I am able to provide a single link [https://tietracker.app.link/](https://tietracker.app.link/) which will guide you either to the installed app, the store or if none of these to the PWA.

*****

### Intercept Parameters

That being setup, you may be interested to intercept parameters across the all process by keeping in mind of course that tracking is bad and only anonymous usage is acceptable.

*****

#### Installation 

The related Cordova plugin finds place in [npm](https://www.npmjs.com/package/branch-cordova-sdk) and can be use as following:

```bash
ionic cordova plugin add branch-cordova-sdk
```

*****

#### Configuration

One installed, you will have to configure it for your platforms. In your `config.xml` a related entry will have to be added.

All Branch’s information are going to be provided by them when you set up your application and the iOS team release identifier finds place in your Apple “appstoreconnect” dashboard.

```xml
<branch-config>
    <branch-key value="key_live_2ad987a7d8798d7a7da87ad8747" />
    <uri-scheme value="myapp" />
    <link-domain value="myapp.app.link" />
    <ios-team-release value="BE88ABJS2W" />
</branch-config>
```

*****

### Implementation

[Ionic Native](https://ionicframework.com/docs/native/branch-io) provides support for Branch but I never used it so far, that’s why I will not use it in the following example. I also only implemented it in [Angular](https://angular.io/) apps with Cordova, that’s why I’m using here such technologies.

In our main component `app.component.ts` we first declare a new interface which represent the parameter we are interested to intercept. In this example I named it `$myparam` . Worth to notice that, out of the box, Branch fill forward parameters prefixed with **$.**

```javascript
interface DeeplinkMatch {
    $myparam: string;
}
```

Once our main component is initialized, we add a listener on the platform in order to initialize the interception only once it is mounted.

```javascript
ngAfterViewInit() {
    this.platform.ready().then(async () => {
        await this.initDeepLinking();
    });
}
```

According the device of the user, he/she may start the application either as a mobile app or as a web application. These are two different ways of querying the parameters and that’s why we are handling the differently.

```javascript
private async initDeepLinking(): Promise<void> {
    if (this.platform.is('cordova')) {
        await this.initDeepLinkingBranchio();
    } else {
        await this.initDeepLinkingWeb();
    }
}
```

When it comes to the web, we can search for the parameters using the `platform`. It they can be provided and prefixed in different ways, sure thing, I like to test all possibilities.

```javascript
private async initDeepLinkingWeb(): Promise<void> {
    const myparam: string = 
                   this.platform.getQueryParam('$myparam') ||
                   this.platform.getQueryParam('myparam') ||
                   this.platform.getQueryParam('%24myparam');
    console.log('Parameter', myparam);
}
```

Finally, we can handle the mobile app parameter provided by Branch.

Important to notice is the fact that the parameter is provided **asynchronously**. That’s why you can’t amend that it is present at startup but have to think that it may be provided afterwards with delay.

```javascript
private async initDeepLinkingBranchio(): Promise<void> {
    try {
        const branchIo = window['Branch'];
        if (branchIo) {
            const data: DeeplinkMatch = 
                        await branchIo.initSession();

            if (data.$myparam !== undefined) {
                console.log('Parameter', data.$myparam);
            }
        }
    } catch (err) {
        console.error(err);
    }
}
```

And voilà 🥳, we are able to handle deep links with parameters. If for example we would provide an URL such as [https://myapp.app.link/?$myparam=yolo](https://myapp.app.link/?$myparam=yolo) to our users, we would be able to intercept “yolo” 😁.

*****

#### Altogether

In case you would need it, here is the above code in a single piece:

```javascript
import {AfterViewInit, Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

interface DeeplinkMatch {
    $myparam: string;
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements AfterViewInit {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngAfterViewInit() {
        this.platform.ready().then(async () => {
            await this.initDeepLinking();
        });
    }

    private async initDeepLinking(): Promise<void> {
        if (this.platform.is('cordova')) {
            await this.initDeepLinkingBranchio();
        } else {
            await this.initDeepLinkingWeb();
        }
    }

    private async initDeepLinkingWeb(): Promise<void> {
        const myparam: string = 
                       this.platform.getQueryParam('$myparam') ||
                       this.platform.getQueryParam('myparam') ||
                       this.platform.getQueryParam('%24myparam');
        console.log('Parameter', myparam);
    }

    private async initDeepLinkingBranchio(): Promise<void> {
        try {
            const branchIo = window['Branch'];

            if (branchIo) {
                const data: DeeplinkMatch = 
                            await branchIo.initSession();

                if (data.$myparam !== undefined) {
                    console.log('Parameter', data.$myparam);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}
```

*****

### Summary

It works out. To be honest with you, not the funniest part of the job, not that it is complicated or anything to set up or to be used, just, not really fun. 

Stay home, stay safe!

David

---
path: "/blog/get-app-name-and-version-in-angular"
date: "2020-03-22"
title: "Get App Name And Version In Angular"
description: "How to read or display the name and version of your application in Angular without duplicating these information"
tags: "#angular #javascript #webdev #typescript"
image: "https://cdn-images-1.medium.com/max/1600/1*KwiK0jtPVZnLUyZV1BPdag.png"
canonical: "https://medium.com/@david.dalbusco/get-app-name-and-version-in-angular-8aa18eaa9f0e"
---

![](https://cdn-images-1.medium.com/max/1600/1*KwiK0jtPVZnLUyZV1BPdag.png)

_Photo by [Joe Chau](https://unsplash.com/@joechau?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-height** days left until hopefully better days.

---

Today, Sunday, I had to upgrade an application I’ve developed last year with [Ionic](https://ionicframework.com) and [Angular](https://angular.io) because my client seems to finally have decided to publish it in stores (better start without technical debt 😉).

I’ve to say, the update process to Angular v9 and Ionic v5 went just smoothly. It took me a bit more time to upgrade the [Cordova](https://cordova.apache.org) plugins, specially the one dedicated to Firebase, but fortunately I found the solution shared by his maintainer, [Dave Alden](https://twitter.com/dpa99c), who always does an outstanding job.

Once done, I was still facing one last issue. I didn’t touched the app in months and meanwhile, Google Analytics had been really deprecated and I was not able anymore to build my platform because the corresponding plugin was outdated.

Instead of finding the solution, I just removed my old GA implementation and migrated to the new Firebase Analytics implementation in less time than expected.

For the web, I’m using [AngularFire](https://github.com/angular/angularfire), which offers an option to track deployments with application’s name and versions.

Therefore here is how you can get or read the name and version of your application in Angular.

---

### Import JSON File In TypeScript

We don’t want to duplicate the app’s name or version, that’s why I suggest that we read these from our `package.json` . In order to import JSON files in TypeScript, we need to instruct the compiler to accept such type of data. To do so, in our `tsonfig.json` we turn the option `resolveJsonModule` to `true` .

```json
"compilerOptions": {
  "resolveJsonModule": true
},
```

---

### Environment Variables

A convenient way to handle environment variables is possible, out of the box, in Angular through the use of the multiples `environment.ts` files. That’s why we enhance these to “inject” our application’s name and version.

```javascript
import { name, version } from "../../package.json";

export const environment = {
	production: true,
	name,
	version
};
```

That’s it, in our code we have now access the information 😁.

---

### AngularFire Analytics

If like me, you use AngularFire and would like to track these information, proceed as the following in your `app.module.ts` . Note that in the spinet I also set `anonymize_ip` to `true` , as it should, in my humble opinion, always be the case.

```javascript
import { AngularFireAnalyticsModule, APP_NAME, APP_VERSION, CONFIG } from "@angular/fire/analytics";

import { environment } from "../environments/environment";

@NgModule({
	providers: [
		{
			provide: CONFIG,
			useValue: {
				allow_ad_personalization_signals: false,
				anonymize_ip: true
			}
		},
		{ provide: APP_NAME, useValue: environment.name },
		{ provide: APP_VERSION, useValue: environment.version }
	]
})
export class AppModule {}
```

---

### Summary

I’m agree, this isn’t the deepest and longest blog post I have ever written but I hope it might be useful anyway to someone in the future, one never knows 😄.

Stay home, stay safe!

David

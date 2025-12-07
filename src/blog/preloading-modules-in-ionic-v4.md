---
path: "/blog/preloading-modules-in-ionic-v4"
date: "2018-08-23"
title: "Preloading modules in Ionic v4"
description: "Preloading modules in Ionic v4"
tags: "#ionic #angular"
image: "https://daviddalbusco.com/assets/images/1*6gmGYZk8Cgx2WNqOMERlLA.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*6gmGYZk8Cgx2WNqOMERlLA.jpeg)

I’m currently migrating my mobile application [Fluster](https://fluster.io/) from [Ionic](https://ionicframework.com/) v3 to v4. As you could see in the following video, the very first time a user would access the detail page, he/she would face a small delay 😔 The reason behind this is simple, the remaining (or not loaded yet) modules of the **lazy-loaded Angular** route still have to be loaded

![](https://daviddalbusco.com/assets/images/1*Uu2ONN9g4VTqkcfzmV5sXw.gif)
<span class="figcaption_hack">A small delay</span>

Fortunately, [Angular](https://angular.io/) v6 offers the ability to preload all or selected modules. This has been described many times, like for example in the interesting article of [Adrian Fâciu](https://medium.com/@adrianfaciu/custom-preloading-strategy-for-angular-modules-b3b5c873681a)

However, the different solutions provided in all these tutorials weren’t enough or successful for my use case

#### Problems

At first, I tried the out of the box Angular strategy `PreloadAllModules` which, believe me or not, had a negative effect on my boot time making it slower 😱 which of course I would avoid at any price, a slow boot time being one of my nemesis

I tried then the strategy of preloading only the module of my detail page. Unfortunately, again, the results didn’t match my expectation. The modules were effectively loaded too early regarding my flow or were loaded in the same time as the module of the main page, which again had for effect to slow down my boot time 😢

![](https://thepracticaldev.s3.amazonaws.com/i/0129tfgjf4i8hgc3mfvv.png)
<span class="figcaption_hack">Without preloading</span>

![](https://thepracticaldev.s3.amazonaws.com/i/bo40x3m3ytmm8j49q43l.png)
<span class="figcaption_hack">With preloading a specific page, the modules were loaded but in the meantime as the others</span>

Facing that situation, I then tried the solution described by [Adrian Fâciu](https://medium.com/@adrianfaciu) which worked well but only to some extension. The modules of the detail page were effectively loaded afterwards but I kind of had the feeling that loading modules after a delay was bit “random” for my specific case

![](https://thepracticaldev.s3.amazonaws.com/i/0y0z0f845mqx67y98wy0.png)
<span class="figcaption_hack">Preloading the modules of the detail page after a delay</span>

### Solution

Fortunately, together with [Aaron Sterling](https://github.com/Aaron-Sterling), while exchanging on the [Ionic Forum](https://forum.ionicframework.com/t/v4-preloadmodules/137984), we were able to find a solution which fitted my needs 😃 I so much ❤️ the Ionic community

The idea was to implement a **custom preloading strategy** and to **trigger it only on demand** respectively, in my case, to start the preloading when my main page would be ready

**Implementation of the solution**

First of all, we need a new provider which will collect the routes we may want to preload and offers the ability to preload a specific route on demand

```
import {PreloadingStrategy, Route} from '@angular/router';

import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';

export interface RouteToPreload {
    routePath: string;
    route: Route;
    load: Function;
}

@Injectable({
    providedIn: 'root'
})
export class AppRoutingPreloaderService implements PreloadingStrategy {

    private routesToPreload: RouteToPreload[] = [];

    constructor() {
    }

    preload(route: Route, load: Function): Observable<any> {
        if (route.data && route.data.preload) {
            this.routesToPreload.push({
                routePath: route.path,
                route: route,
                load: load
            });
        }

        return of(null);
    }

    preloadRoute(path: string): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.routesToPreload &&
                this.routesToPreload.length > 0) {
                const routeToPreload: RouteToPreload =
                    this.routesToPreload.find(
                       (filterRouteToPreload: RouteToPreload) =>
                       filterRouteToPreload.routePath === path);

                if (routeToPreload) {
                    routeToPreload.load();
                }
            }

            resolve();
        });
    }
}
```

_Note: currently the provider may be loaded twice and therefore collect twice the routes. This isn’t such a problem here because we don’t preload anything per default and because the effective preload will take care of only loading the first route which have been collected_

Then, as described in other articles, we could modify our `app-routing.module.ts` in order to provide our custom preloading strategy and to specify which routes are candidates for the preloading

```
const routes: Routes = [
     {
      path: 'main',
      loadChildren: './pages/main.module#MainPageModule'
    },
    {
      path: 'detail',
      loadChildren: './pages/detail.module#DetailPageModule',
      data: {preload: true}
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,
                 {preloadingStrategy: AppRoutingPreloaderService}
             )],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
```

Finally, let the magic happens ✨, we could use the provider in our selected page where we would like to trigger the preloading on demand, for example starting at the lifecycle of our choice like `ionViewDidEnter` or `afterViewChecked`

```
@Component({
    selector: 'app-main',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
})
export class ItemsPage {

  constructor(private routingService: AppRoutingPreloaderService) {}
  async ionViewDidEnter() {
    await this.routingService.preloadRoute('details');
  }
}
```

Doing so, as you could see in the next screenshot, the modules of my detail page are preloaded smoothly after my app as successfully booted and after the main page has been displayed and being set has ready for interactions

![](https://thepracticaldev.s3.amazonaws.com/i/ad3jufcxts4y8b9iig81.png)
<span class="figcaption_hack">Preloading the modules of the detail page after the main page did entered</span>

Voilà ✌️The solution still need some more testing on real devices but I’m confident that from now on, when my users will use my Ionic v4 app and will access the detail page for the very first time, they will face a slighter smaller delay or even almost none 😉

I hope this solution could helps you a bit too if you would like to preload some routes or pages in your awesome app 😁

To infinity and beyond 🚀

David

---
path: "/blog/infinite-scroll-with-ionic-angular-and-firestore"
date: "2020-01-27"
title: "Infinite Scroll with Ionic, Angular and Firestore"
description: "How to implement an infinite scroll with Ionic, Angular and Google Cloud Firestore"
tags: "#webdev #angular #javascript #tutorial"
image: "https://cdn-images-1.medium.com/max/1600/1*yJGFgDFrXEnvCT3cEm_kOg.jpeg"
canonical: "https://medium.com/@david.dalbusco/infinite-scroll-with-ionic-angular-and-firestore-f7a66e0e942c"
---

![](https://cdn-images-1.medium.com/max/1600/1*yJGFgDFrXEnvCT3cEm_kOg.jpeg)

*Photo by [Dan Schiumarini](https://unsplash.com/@dan_schiumarini?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

Once again I find myself having to find a new place to live in Zürich City and therefore once again I have to use search engines and platforms to browse flats, that were never upgraded, in terms of UX and even sometimes design, since the ’90s 🙈.

Yesterday morning, while I was about to visit such websites, I realize that there are no ways to me to undergo the frustration of using these for weeks or months, again 😤. That’s why I spent my Sunday writing a personal crawler with [Puppeteer](https://github.com/puppeteer/puppeteer) and  [Google Firebase](https://firebase.google.com/) and why I developed quickly today, an [Ionic](https://ionicframework.com) and [Angular](https://angular.io) app to browse the outcome. Because it is not the first time I program an [Infinite Scroll](https://ionicframework.com/docs/api/infinite-scroll) with such a technology stack, I finally came to the idea to share my implementation in this new blog post.

### Prerequisites

In this post we are going to use Ionic, Angular, a [Google Cloud Firestore](https://cloud.google.com/firestore/) database and also [AngularFire](https://github.com/angular/angularfire) and [RxJS](https://rxjs-dev.firebaseapp.com/). I am not going to describe how to install and configure each of these requirements. If you would face problems setting up these, don’t hesitate to contact me.

### Service

One asset I like in Angular is the separation of concern. We create a new `service` which should take care of interacting with the database.

```bash
ionic g service feed
```

In the following lines I’ll use the `interface` and generic name `Item` to represent the data we are looking to fetch and I’ll declare these interfaces in the same class as our service. Replace it with the real description of your data 😉.

```javascript
import {DocumentReference} from '@angular/fire/firestore';

interface ItemData {
  title: string;
  content: string;
}

interface Item {
  id: string;
  ref: DocumentReference;
  data: ItemData;
}
```

In our newly created service, we declare the following variables:

1. `itemsSubject` : a state container for our items
2. `lastPageReached` : another state, a `boolean` , to notice if we have or not yet fetched all the data
3.  `nextQueryAfter` : a reference to the last Firestore document fetched to index our database queries
4.  `paginationSub` and `findSub` : two subscriptions to stop observing the changes and to clean the memory when needed

Moreover, we also declare a service to interact with Firestore, a method `destroy` to unsubscribe the observers and we expose two functions to return our subjects as observables.

```javascript
import {Injectable} from '@angular/core';

import {AngularFirestore, DocumentReference, QueryDocumentSnapshot} 
  from '@angular/fire/firestore';
import {BehaviorSubject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private itemsSubject: BehaviorSubject<Item[] | undefined> = 
                        new BehaviorSubject(undefined);

  private lastPageReached: BehaviorSubject<boolean> = 
                           new BehaviorSubject(false);

  private nextQueryAfter: QueryDocumentSnapshot<ItemData>;

  private paginationSub: Subscription;
  private findSub: Subscription;

  constructor(private fireStore: AngularFirestore) {
  }

  destroy() {
    this.unsubscribe();
  }

  private unsubscribe() {
    if (this.paginationSub) {
      this.paginationSubscription.unsubscribe();
    }

    if (this.findSub) {
      this.findSubscription.unsubscribe();
    }
  }

  watchItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  watchLastPageReached(): Observable<boolean> {
    return this.lastPageReached.asObservable();
  }
}
```

We have to query the data in Firestore step by step respectively using a pagination because we are going to implement an infinite scroller. For that purpose, Google provides [startAfter](https://firebase.google.com/docs/firestore/query-data/query-cursors) which instruct the database to “skip” the matching entities before the given start point. It is also worth to notice that in order to be able to perform such queries, we also need to sort these with `orderBy` and that I limited the pagination to 10 elements per step with the option `limit`.

```javascript
find() {
  try {
    const collection: AngularFirestoreCollection<ItemData> = 
                      this.getCollectionQuery();

    this.unsubscribe();

    this.paginationSub = collection.get()
                         .subscribe(async (first) => {
      this.nextQueryAfter = first.docs[first.docs.length - 1] as          
                            QueryDocumentSnapshot<ItemData>;

      await this.query(collection);
    });
  } catch (err) {
    throw err;
  }
}

private getCollectionQuery(): AngularFirestoreCollection<ItemData> {
  if (this.nextQueryAfter) {
    return this.fireStore.collection<ItemData>('/items/', ref =>
           ref.orderBy('created_at', 'desc')
             .startAfter(this.nextQueryAfter)
             .limit(10));
  } else {
    return this.fireStore.collection<ItemData>('/items/', ref =>
           ref.orderBy('created_at', 'desc')
             .limit(10));
  }
}
```

To that point, we have implemented a `find` function which query the database, therefore we can now develop the part where we collect the results and add these to our state container.

```javascript
private query(collection: AngularFirestoreCollection<ItemData>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      this.findSubscription = collection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data: ItemData = 
                        a.payload.doc.data() as ItemData;
            const id = a.payload.doc.id;
            const ref = a.payload.doc.ref;

            return {
              id,
              ref,
              data
            };
          });
        })
      ).subscribe(async (items: Item[]) => {
        await this.addItems(items);

        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

private addItems(items: Item[]): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!items || items.length <= 0) {
      this.lastPageReached.next(true);

      resolve();
      return;
    }

    this.itemsSubject.asObservable().pipe(take(1))
                     .subscribe((currentItems: Item[]) => {
      this.itemsSubject.next(currentItems !== undefined ? 
            [...currentItems, ...items] : [...items]);

      resolve();
    });
  });
}
```

### Component: Logic

Our service is ready to go, we could now create a new component for the presentation and interaction with the user:

```bash
ionic g component feed
```

In this newly created component, we declare the following variables:

1. `infiniteScroll` : a reference to the component scroller to disable it when there will be nothing left to query
2. `items$` : an observable which will point to our state of data respectively the data we are looking to display
3. `loaded` : a boolean to display a message when our application is performing the very first query
4.  `lastPageReachedSub` : a subscription to free the observer when we are done

Moreover, we are also referencing the service we created previously and we are implementing `OnInit` , which we are going to implement afterwards, and `OnDestroy` to unsubscribe our observer.

```javascript
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonInfiniteScroll} from '@ionic/angular';

import {Observable, Subscription} from 'rxjs';

import {FeedService, Item} from './feed.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll, {static: false}) 
             infiniteScroll: IonInfiniteScroll;

  items$: Observable<Item[]>;

  loaded = false;

  private lastPageReachedSub: Subscription;

  constructor(private feedService: FeedService) {
  }

  ngOnDestroy() {
    if (this.lastPageReachedSub) {
      this.lastPageReachedSub.unsubscribe();
    }
  }

}
```

To complete our component, we add the following `ngOnInit` function which will takes care of:

1. Initializing our state observer
2. Observing the pagination to disable the infinite scroller component when nothing left to be queried
3. Notifying when something as been loaded at least once

```javascript
async ngOnInit() {
  this.items$ = this.feedService.watchItems();

  this.lastPageReachedSub = 
      this.feedService.watchLastPageReached()
                      .subscribe((reached: boolean) => {
     if (reached && this.infiniteScroll) {
       this.loaded = true;
       this.infiniteScroll.disabled = true;
     }
  });

  this.feedService.watchItems().pipe(
      filter(flats => flats !== undefined),
      take(1)).subscribe((_items: Item[]) => {
    this.loaded = true;
  });
}
```

We add a very last method called `findNext` which will be triggered by the scroller component when the user reaches the bottom of the page and which will be use to fetch the next data.

```javascript
async findNext($event) {
  setTimeout(async () => {
    await this.feedService.find();
    $event.target.complete();
  }, 500);
}
```

### Component: Rendering

Our JavaScript code is ready, we can add the HTML implementation of our component.

```html
<ng-container *ngIf="loaded; else feedLoading;">
  <ion-card *ngFor="let item of (items$ | async);">
    <ion-card-header>
      <ion-card-title>{{item.data.title}}</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <p>{{item.data.content}}</p>
    </ion-card-content>
  </ion-card>

  <ion-infinite-scroll (ionInfinite)="findNext($event)">
    <ion-infinite-scroll-content>
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ng-container>

<ng-template #feedLoading>
  <main>
    Initializing your feed...
  </main>
</ng-template>
```

Finally, we define a minimal height for our cards in the related SCSS file. Without it, the scroller component might never been used as it will only trigger its action if the content of the window has effectively a scroll (“no scroll will happens if nothing to scroll”).

```css
ion-card {
  min-height: 1080px;
}
```

Voilà, we have implemented an infinite scroller with Ionic, Angular and Firestore 🎉

### Cherry On The Cake 🍒🎂

The above code is related to Angular but Ionic could be use with or without any modern frameworks. We notably use the same approach in our web open source editor for presentations, [DeckDeckGo](https://deckdeckgo.com), which is developed with Stencil. If you are interested by such solution, have a look at our source code on [GitHub](https://github.com/deckgo/deckdeckgo) or ping me if you want me to share the solution in a new blog post 😁.

To infinity and beyond 🚀

David

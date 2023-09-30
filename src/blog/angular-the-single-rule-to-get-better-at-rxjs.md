---
path: "/blog/angular-the-single-rule-to-get-better-at-rxjs"
date: "2021-09-10"
title: "Angular: The Single Rule To Get Better At RxJS"
description: "A guideline that helps develop Angular applications and libraries in a reactive programming way with RxJS."
tags: "#angular #rxjs #javascript #beginners"
image: "https://cdn-images-1.medium.com/max/1600/0*nigHuCYvLjp9d92D.jpg"
canonical: "https://daviddalbusco.medium.com/angular-the-single-rule-to-get-better-at-rxjs-6bd9f9786429"
---

![](https://cdn-images-1.medium.com/max/1600/0*nigHuCYvLjp9d92D.jpg)

---

Even though there is no strict rule, combining imperative and declarative programming concepts with [RxJS](https://rxjs.dev/) might be making the development harder and the code less clean.

Shifting mind from a (often) default way of programming (i.e. imperative) to a reactive (i.e. declarative) approach, takes time.

However, there is a single rule that can help you make the switch:

⚠️ Do **not** subscribe, period ⚠️

---

> Confused about the difference between imperative and declarative? Have a look to the excellent [article](https://eliteionic.com/tutorials/imperative-vs-declarative-programming-with-rxjs-search-filter/) of [Josh Morony](https://twitter.com/joshuamorony) that compares both.

---

### Why?

The rule is not strict, it is a guideline, like the code of the pirates of the Caribbean 🏴‍☠️.

![](https://cdn-images-1.medium.com/max/1600/0*VBCiXqgoBrlzo4tQ)

It does not mean that you should never ever subscribe to a stream but rather, that you should try to avoid it. In that way, according my experience, you are going to slowly transform the imperative way of programming into more declarative concepts.

Concretely, while developing features in components, trying to use mostly the [Angular](https://angular.io/) `| async` pipe that automatically unsubscribe when components are destroyed, can in addition to avoid memory leak, help improve the coding style.

To explore such modus operandi, let’s refactor an Angular application that mix imperative and declarative programming concepts.

---

### Starting Point

The following demo uses the [coinpaprika API](https://api.coinpaprika.com) to display a list of cryptocurrencies to its user.

The code source is available on [GitHub](https://github.com/peterpeterparker/rxjs-no-subscribe). Each following chapters (steps [1](https://github.com/peterpeterparker/rxjs-no-subscribe/tree/step_1), [2](https://github.com/peterpeterparker/rxjs-no-subscribe/tree/step_2), [3](https://github.com/peterpeterparker/rxjs-no-subscribe/tree/step_3) and [4](https://github.com/peterpeterparker/rxjs-no-subscribe/tree/step_4)) are separate branches.

![](https://cdn-images-1.medium.com/max/1600/1*Yw5GBUxaeWBeC8bGIgMPlA.png)

It defers the HTTP queries to a `coins.service` and presents the results in a `coins.component`.

---

#### Service

The provider acts as a store. It queries the list of cryptos, filter the results and persists these in memory.

The function `list()` is both reactive, by telling what it wants (`httpClient.get`), and imperative by checking and filtering the results.

```javascript
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type Coin = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root'
})
export class CoinsService implements OnDestroy {
  constructor(private httpClient: HttpClient) {}

  private coins: Coin[] = [];

  private destroy$: Subject<void> = new Subject();

  list() {
    this.httpClient
      .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((allCoins: Coin[]) => {
        if (allCoins.length > 10) {
          this.coins = allCoins.filter(
            (coin: Coin) =>
              !coin.is_new && coin.rank > 0 && coin.rank < 100
          );
        }
      });
  }

  getCoins(): Coin[] {
    return this.coins;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

#### Component

The component initializes the service and exposes a getter binding to parse the results to the UI.

```javascript
import { Component, OnInit } from '@angular/core';
import { CoinsService } from '../coins.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit {
  constructor(private readonly coinsService: CoinsService) {}

  ngOnInit(): void {
    this.coinsService.list();
  }

  get coins() {
    return this.coinsService.getCoins();
  }
}
```

---

#### Template

The HTML list the coins.

```html
<article *ngFor="let coin of coins">
	<h1>{{ coin.name }}</h1>
	<p>Symbol: {{ coin.symbol }}</p>
	<p>Rank: {{ coin.rank }}</p>
	<hr />
</article>
```

---

### Step 1: (More) Declarative

Even though I said above that the rule is actually a guideline, I would suggest anyway to **never** subscribe in services, respectively to be more strict about memory leaks.

---

As we do not want to subscribe, we have first to transform the method that is called by the component to return an `Observable` .

```javascript
list(): Observable<Coin[]> {
  return this.httpClient
    .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
    ...
}
```

Without any other changes, the compiler will warn you about the return values that are not matching (as we are still subscribing to the stream and therefore are actually returning a `Subscription`). That’s why, we replace the `subscribe` with an RxJS operator. In the particular case we are using [tap](https://rxjs.dev/api/operators/tap) because we still want to assign the result to the store.

```javascript
list(): Observable<Coin[]> {
  return this.httpClient
    .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
    .pipe(
      tap((allCoins: Coin[]) => {
        if (allCoins.length > 10) {
          this.coins = allCoins.filter(
            (coin: Coin) =>
              !coin.is_new && coin.rank > 0 && coin.rank < 100
          );
        }
      }),
      takeUntil(this.destroy$))
}
```

Because we are now not subscribing anymore, we can remove the `takeUntil` and let the caller handles the way it streams the data.

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export type Coin = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  constructor(private httpClient: HttpClient) {}

  private coins: Coin[] = [];

  list(): Observable<Coin[]> {
    return this.httpClient
      .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
      .pipe(
        tap((allCoins: Coin[]) => {
          if (allCoins.length > 10) {
            this.coins = allCoins.filter(
              (coin: Coin) =>
                !coin.is_new && coin.rank > 0 && coin.rank < 100
            );
          }
        })
      );
  }

  getCoins(): Coin[] {
    return this.coins;
  }
}
```

The code has already become cleaner, no more subscription and destroy lifecycle but, the code is still mixing different approaches. That’s why we take advantages of RxJS [filter](https://rxjs.dev/api/operators/filter) and [map](https://rxjs.dev/api/operators/map) operators to make it more reactive.

```javascript
list(): Observable<Coin[]> {
  return this.httpClient
    .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
    .pipe(
      filter((allCoins: Coin[]) => allCoins.length > 10),
      map((allCoins: Coin[]) =>
        allCoins.filter(
          (coin: Coin) =>
            !coin.is_new && coin.rank > 0 && coin.rank < 100
        )
      ),
      tap((topCoins: Coin[]) => (this.coins = topCoins))
    );
}
```

The imperative `if` has become a reactive `filter` and the `array.filter` has been moved to a `map` transformer. Thanks to these last modifications the data sources flow through the stream that describe what we want as a results.

---

### Step 2: Subscribe In Component

Even though the code still compiles, at this point no currencies are displayed anymore because no caller is using, is subscribing, to the stream.

![](https://cdn-images-1.medium.com/max/1600/1*kNHqMcjFeNKFFOYNAZZMBg.png)

As we are proceeding iteratively, we basically reproduce what we removed in the service earlier, we subscribe within the component.

```javascript
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CoinsService } from '../coins.service';
@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit, OnDestroy {
  constructor(private readonly coinsService: CoinsService) {}

  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.coinsService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get coins() {
    return this.coinsService.getCoins();
  }
}
```

I know, I said “never subscribe”, this ain’t the end 😉. Nevertheless, we notice that the cryptos are listed again.

![](https://cdn-images-1.medium.com/max/1600/1*HB1cJ9j7em8iz4QodbUvHg.png)

---

### Step 3: Async Pipe

To reach our ultimate goal, we want to remove the subscription in the component in order to leverage the `| async` pipe. Therefore, we have to improve our service. On the other hand, we still want it to act as a store.

That’s why, as an intermediate step, we replace the imperative state `coins` of the service with a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject), a special type of Observable that allows values to be multicasted to many Observers ([source](https://rxjs.dev/guide/subject)), and exposes it streams publicly as a `readonly Observable` variable.

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

export type Coin = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  constructor(private httpClient: HttpClient) {}

  private coins: BehaviorSubject<Coin[]> = new BehaviorSubject<
    Coin[]
  >([]);

  readonly coins$: Observable<Coin[]> = this.coins.asObservable();

  list(): Observable<Coin[]> {
    return this.httpClient
      .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
      .pipe(
        filter((allCoins: Coin[]) => allCoins.length > 10),
        map((allCoins: Coin[]) =>
          allCoins.filter(
            (coin: Coin) =>
              !coin.is_new && coin.rank > 0 && coin.rank < 100
          )
        ),
        tap((topCoins: Coin[]) => this.coins.next(topCoins))
      );
  }
}
```

In comparison to our previous changes, this is breaking. That’s why we have to adapt the component to remove the `getter` and replace it with an observable we can ultimately use in the template.

```javascript
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Coin, CoinsService } from '../coins.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit, OnDestroy {
  constructor(private readonly coinsService: CoinsService) {}

  private destroy$: Subject<void> = new Subject<void>();

  coins$: Observable<Coin[]> = this.coinsService.coins$;

  ngOnInit(): void {
    this.coinsService
      .list()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

Finally, we introduce the famous `async` pipe.

```javascript
<article *ngFor="let coin of coins$ | async">
```

---

### Step 4: No Subscribe And Reactive

Our current solution is really close to comply with the goals, we are using a stream to get the data and to display the results but, we still have to subscribe to trigger the loading the currencies.

That’s why we try to remove the subject.

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export type Coin = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  constructor(private httpClient: HttpClient) {}

  readonly coins$: Observable<Coin[]> = ... // <- TODO

  list(): Observable<Coin[]> {
    return this.httpClient
      .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
      .pipe(
        filter((allCoins: Coin[]) => allCoins.length > 10),
        map((allCoins: Coin[]) =>
          allCoins.filter(
            (coin: Coin) =>
              !coin.is_new && coin.rank > 0 && coin.rank < 100
          )
        )
      );
  }
}
```

We notice the exposed observable, `coins$`, is now lacking a source.

On the other hand, we still have the stream that process the flow of the data as we except.

Yes, that’s right, we connect both.

```javascript
readonly coins$: Observable<Coin[]> = this.httpClient
  .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
  .pipe(
    filter((allCoins: Coin[]) => allCoins.length > 10),
    map((allCoins: Coin[]) =>
      allCoins.filter(
        (coin: Coin) =>
          !coin.is_new && coin.rank > 0 && coin.rank < 100
      )
    )
  );
```

However, doing so, we do loose the state management feature we had in place thanks to the use of the BehaviorSubject. That’s why we introduce a [shareReplay](https://rxjs.dev/api/operators/shareReplay) that will also replay values, that will also make our service acts as a store.

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import {filter, map, shareReplay} from 'rxjs/operators';

export type Coin = Record<string, string | number | boolean>;

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  constructor(private httpClient: HttpClient) {}

  readonly coins$: Observable<Coin[]> = this.httpClient
    .get<Coin[]>(`https://api.coinpaprika.com/v1/coins`)
    .pipe(
      filter((allCoins: Coin[]) => allCoins.length > 10),
      map((allCoins: Coin[]) =>
        allCoins.filter(
          (coin: Coin) =>
            !coin.is_new && coin.rank > 0 && coin.rank < 100
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
}
```

> If you never used shareReplay before, be careful when using it. Read more in the [blog post](https://blog.strongbrew.io/share-replay-issue/) of Kwinten Pisman.

Finally, we can remove our last subscription in the component and also all linked code that has for goal to handle the un-subscription.

```javascript
import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { Coin, CoinsService } from '../coins.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent {
  constructor(private readonly coinsService: CoinsService) {}

  readonly coins$: Observable<Coin[]> = this.coinsService.coins$;
}
```

If you compare to its original version, has not the component become really slim and easy to understand?

A last check to the GUI.

![](https://cdn-images-1.medium.com/max/1600/1*HB1cJ9j7em8iz4QodbUvHg.png)

All cryptos are still listed, the code is reactive and, we are not using any “subscribe” anymore 🥳.

---

### Summary

Trying to not subscribe using RxJS in Angular is not a finality nor a strict rule but, when applied as a guideline, can help make the code cleaner and reactive, can help with the experience and time get better at RxJS.

To infinity and beyond!

David

---
path: "/blog/test-angular-pipes-with-services"
date: "2020-03-25"
title: "Test Angular Pipes With Services"
description: "How to test an Angular pipe which uses injected services"
tags: "#angular #testing #javascript #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*q3KXO31t7qXMjn0bf5Z3OQ.png"
canonical: "https://medium.com/@david.dalbusco/test-angular-pipes-with-services-4cf77e34e576"
---

![](https://cdn-images-1.medium.com/max/1600/1*q3KXO31t7qXMjn0bf5Z3OQ.png)

_Photo by [Guillaume TECHER](https://unsplash.com/@guillaume_t?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Twenty-five** days left until hopefully better days.

---

Today I spent much time deep focused at writing new [Angular](https://angular.io) components and their related unit tests, that I even missed this morning online “stand-up” and almost feel like I spend my day in some kind of vortex.

Anyway, I like this challenge, I don’t want to skip today’s blog post and I would like to share with you how I tested a new pipe I created. Moreover, I don’t pretend to be the champion of the exercise, therefore, if you notice anything which can be enhanced, ping me with your comments, I would be happy to improve my skills 🙏.

---

### Create A Pipe

Let’s first create a blank pipe called “filter” with the `ng` command line.

```bash
ng g pipe filter
```

This creates a blank pipe like the following:

```javascript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
```

And it’s related test:

```javascript
import { FilterPipe } from "./filter.pipe";

describe("FilterPipe", () => {
	it("create an instance", () => {
		const pipe = new FilterPipe();
		expect(pipe).toBeTruthy();
	});
});
```

You can be or not an Angular fan but I think we can all be agree that it’s pretty cool to have a CLI which creates class and related test without any effort.

---

### Create A Service

As staten in my opening, the goal is to test a pipe which uses an injected service.

```bash
ng g service translation
```

For demo purpose, we create this dummy service “translation” wich return not that much except either “Génial” or “Awesome” as an observable.

```javascript
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    translate(lang: string): Observable<string> {
        return of(lang === 'fr' ? 'Génial' : 'Awesome');
    }
}
```

---

### Implement Pipe

Our service being ready, we use it to enhance our pipe.

```javascript
import { Pipe, PipeTransform } from '@angular/core';

import { TranslationService } from './translation.service';
import { Observable } from 'rxjs';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    constructor(private translationService: TranslationService) {}

    transform(lang: string): Observable<string> {
        return this.translationService.translate(lang);
    }
}
```

Which by the way can be use with the help of the `async` pipe in a template (in following example, `lang` is a public string variable of the component)

```html
<textarea [value]="lang | filter | async"></textarea>
```

---

### Update Pipe Test

Locally I’m still able to run my test without errors but, because we are now injecting a service in our pipe, if we open the related unit test we notice a TypeScript error on the constructor `TS2554: expected 1 arguments, but got 0` . To fix this we have now to either inject the service or mock it.

---

#### Resolving Service In Test

You can either resolve the service via the `inject` function or `TestBed` . Because the first solution didn’t worked out for me, the second one was my fallback.

```javascript
import { FilterPipe } from './filter.pipe';
import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('FilterPipe', () => {
  beforeEach(() => {
    TestBed
      .configureTestingModule({
        providers: [
          TranslationService
        ]
      });
  });

  it('create an instance', () => {
    const service: TranslationService =
                              TestBed.get(TranslationService);

    const pipe = new FilterPipe(service);
    expect(pipe).toBeTruthy();
  });
});
```

---

#### Mock Service

Another solution, the one I actually finally applied, is creating a mock of the service instead of providing it.

```javascript
import { FilterPipe } from './filter.pipe';
import { of } from 'rxjs';
import { TranslationService } from './translation.service';

describe('FilterPipe', () => {
  let translationServiceMock: TranslationService;

  beforeEach(() => {
    translationServiceMock = {
      translate: jest.fn((lang: string) => of('Awesome'))
    } as any;
  });

  it('create an instance', () => {
    const pipe = new FilterPipe(translationServiceMock);
    expect(pipe).toBeTruthy();
  });
});
```

---

### Test Pipe Transform

So far we were able to test that our pipe can be created even if it relies on a service but we are still not effectively testing its outcome. Therefore, here is the final piece, in which I use the mock of the service. Basically, once the pipe is created, we can access its `transform` method and proceed with some common testing.

```javascript
import { FilterPipe } from './filter.pipe';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { TranslationService } from './translation.service';

describe('FilterPipe', () => {
  let translationServiceMock: TranslationService;

  beforeEach(() => {
    translationServiceMock = {
      translate: jest.fn((lang: string) => of('Awesome'))
    } as any;
  });

  it('create an instance', () => {
    const pipe = new FilterPipe(translationServiceMock);
    expect(pipe).toBeTruthy();
  });

  it('should translate', () => {
    const pipe = new FilterPipe(translationServiceMock);
    pipe.transform('en')
      .pipe(take(1))
      .subscribe((text: string) => {
        expect(text).not.toBe(null);
        expect(text).toEqual('Awesome');
      });
  });
});
```

---

### Summary

It still takes me a bit to find the right testing setting for projects, specially when they are new, but as soon as everything is in place as soon as I can access the `nativeElement` to perform queries, as I would do in a Web Component, I feel more comfortable and it began to be fun 😁.

Stay home, stay safe!

David

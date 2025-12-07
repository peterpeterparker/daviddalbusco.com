---
path: "/blog/test-angular-components-and-services-with-http-requests-mocks"
date: "2020-04-01"
title: "Test Angular Components and Services With HTTP Mocks"
description: "How to test Angular Components and Services with the help of mocked HTTP requests"
tags: "#angular #testing #javascript #webdev"
image: "https://daviddalbusco.com/assets/images/1*ARj7jYIrVb-eR7B0OOD2Zg.png"
canonical: "https://medium.com/@david.dalbusco/test-angular-components-and-services-with-http-mocks-e143d90fa27d"
---

![](https://daviddalbusco.com/assets/images/1*ARj7jYIrVb-eR7B0OOD2Zg.png)

_Photo by [Josue Isai Ramos Figueroa](https://unsplash.com/@jramos10?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Eighteen** days left until hopefully better days.

---

The other day I was writing some [Angular](https://angular.io) tests for a new project of one my client and I was about to mock my service function when suddenly the idea hit me: what if instead of mocking my service functions, I would mock the HTTP requests globally for all my tests with the goal to test also my services logic at the same time as I would test my components 🤔

I was able to achieve this goal and that’s why I’m sharing this learning in this new blog post.

---

### Setup

Let’s define a simple setup as example.

We have a `service` which exposes a single HTTP request. For the purpose of this tutorial, we can use the amazing free and open source API provided by the [Dog API](https://dog.ceo/dog-api/).

```javascript
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';

export interface Dog {
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DogService {

  constructor(private httpClient: HttpClient) {
  }

  randomDog(): Observable<Dog> {
    return this.httpClient
               .get<Dog>(`https://dog.ceo/api/breeds/image/random`);
  }
}
```

And a component which displays the random doggo.

```javascript
import {Component} from '@angular/core';

import {Observable} from 'rxjs';

import {Dog, DogService} from '../dog.service';

@Component({
  selector: 'app-dog',
  template: `<img *ngIf="doggo$ | async as doggo"
                  [src]="doggo.message">`
})
export class DogComponent {

  doggo$: Observable<Dog>;

  constructor(private dogService: DogService) {
    this.doggo$ = dogService.randomDog();
  }

}
```

If you test this component, rendered in your browser you should discover a good doggo like this sweet bulldog.

![](https://daviddalbusco.com/assets/images/1*nEw8NxG6y8xwPwOe9YXf4g.png)

---

### Test Services With HTTP Requests

As we are going to develop a mock for our HTTP requests, we can begin first by testing our service.

To test our service we are going to take advantages of the [HttpClientTestingModule](https://angular.io/api/common/http/testing/HttpClientTestingModule) provided by Angular as [Josué Estévez Fernández](https://medium.com/@Jestfer?source=post_page-----3880ceac74cf----------------------) described in his brillant article about [Angular Testing](https://medium.com/better-programming/testing-http-requests-in-angular-with-httpclienttestingmodule-3880ceac74cf).

Basically, what we do is subscribing to our service exposed function `randomDog()` in order to except a result which should be our mocked data. To triggers the result we instruct the controller that we want to perform only one query using `exceptOne` and finally we `flush` the response with the mock data which will cause our observer to resolve.

```javascript
import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController}
       from '@angular/common/http/testing';

import {Dog, DogService} from './dog.service';

export const mockDog: Dog = {
    message:
    'https://images.dog.ceo/breeds/hound-basset/n02088238_9815.jpg',
    status: 'success'
};

describe('DogService', () => {
  let httpTestingController: HttpTestingController;
  let service: DogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DogService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(DogService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('random should should provide data', () => {
    service.randomDog().subscribe((dog: Dog) => {
      expect(dog).not.toBe(null);
      expect(JSON.stringify(dog)).toEqual(JSON.stringify(mockDog));
    });

    const req = httpTestingController
              .expectOne(`https://dog.ceo/api/breeds/image/random`);

    req.flush(mockDog);
  });
});
```

If you run the tests (`npm run test` ) these should be successfull.

![](https://daviddalbusco.com/assets/images/1*Ko-H8QOYgTlx4xuB9hhhSQ.png)

---

### Test Components With HTTP Requests Mock

Now here comes the fun part 😉. Our goal is to test our component without “touching” the service but by mocking all HTTP requests used by these.

For such purpose we create a custom `HttpInterceptor` , as [sanidz](https://dev.to/sanidz) explained in his/her super article about [Mocking Interceptor](https://dev.to/sanidz/angular-http-mock-interceptor-for-mocked-backend-1h5g), which should take care of, well, intercepting the requests and overriding our calls with our mock data when we have the need. In our example, if the DOG api is hit, we want to answer with the mock data we have defined earlier to test our service.

```javascript
import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import {mockDog} from './dog.service.spec';

@Injectable()
export class HttpRequestInterceptorMock implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler):
              Observable<HttpEvent<any>> {
        if (request.url && request.url
         .indexOf(`https://dog.ceo/api/breeds/image/random`) > -1) {
            return
              of(new HttpResponse({ status: 200, body: mockDog }));
        }

        return next.handle(request);
    }
}
```

When creating the above interceptor you might face a typescript error regarding the decorator. If it is the case you can solve it by enabling `experimentalDecorators` in your `tsconfig.spec.json` .

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "experimentalDecorators": true, <- enable experimental decorator
    "types": [
      "jasmine",
      "node"
    ]
  },
  "files": [
    "src/test.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ]
}
```

Our interceptor being set, we can now test our component. Once again we are going to use the HttpClientTestingModule but moreover we are providing our HTTP interceptor for the configuration of the test. Doing so, on each request, our interceptor will be triggered and we are going to able to mock our data. We are also using these to ensure that our component’s image match the one we have defined as mock.

```javascript
import {async, ComponentFixture, TestBed}
       from '@angular/core/testing';
import {HttpClientTestingModule}
       from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {HttpRequestInterceptorMock}
       from '../http-request-interceptor.mock';

import {mockDog} from '../dog.service.spec';

import {DogComponent} from './dog.component';

describe('DogComponent', () => {
  let component: DogComponent;
  let fixture: ComponentFixture<DogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DogComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpRequestInterceptorMock,
          multi: true
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image', async () => {
    const img: HTMLImageElement =
          fixture.debugElement.nativeElement.querySelector('img');

    expect(img).not.toBe(null);
    expect(mockDog.message === img.src).toBe(true);
  });
});
```

That’s it, it is super, furthermore than being able to test our component we are also able to test our service at the same time 🥳.

![](https://daviddalbusco.com/assets/images/1*S9NnYvTRXnX0ztI0WZkkag.png)

---

### Summary

I’m really grateful to have find the useful tips from [Josué Estévez Fernández](https://medium.com/@Jestfer?source=post_page-----3880ceac74cf----------------------) and [sanidz](https://dev.to/sanidz). The setup is now in place I can really progress in the development of the project while being able to add tests which made sense, at least to me 😉. I hope this approach will help you some day hopefully too.

Stay home, stay safe!

David

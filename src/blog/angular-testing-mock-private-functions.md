---
path: "/blog/angular-testing-mock-private-functions"
date: "2020-04-08"
title: "Angular Testing: Mock Private Functions"
description: "How to mock a private function in your automated Angular tests with Jasmine or Jest"
tags: "#angular #testing #javascript #webdev"
image: "https://cdn-images-1.medium.com/max/1600/1*hVf0bMRV3eeYXaj6D2ZJJg.png"
canonical: "https://medium.com/@david.dalbusco/angular-testing-mock-private-functions-2c5e480ea7bb"
---

![](https://cdn-images-1.medium.com/max/1600/1*hVf0bMRV3eeYXaj6D2ZJJg.png)

*Photo by [Overture Creations](https://unsplash.com/@overture_creations?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/free?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I share [one trick a day](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) until (probably not) the end of the COVID-19 quarantine in Switzerland, April 19th 2020. **Eleven** days left until hopefully better days.

*****

This week I made several progress in one of my client’s project and had therefore to write new test cases. For one of these, I notably had to mock a private function using [Jest](https://jestjs.io).

When I was replicating this test for the purpose of this blog post, I figured out that I was actually using [Jasmine](https://jasmine.github.io) as it is the default test suite used when creating new [Ionic Angular](https://ionicframework.com/docs/angular/your-first-app) applications 😁.

That’s why I am sharing today both solutions or how to mock a private function with Jasmine or Jest 😇.

*****

### Credits

This blog post Jest’s solution has been provided by [Brian Adams](https://stackoverflow.com/users/10149510/brian-adams) on [Stackoverflow](https://stackoverflow.com/questions/56044471/testing-private-functions-in-typescript-with-jest/56045577#56045577). The Jasmine one was inspired by the answer of [jurl](https://stackoverflow.com/users/4936193/jurl) on the same [platform](https://stackoverflow.com/questions/56044471/testing-private-functions-in-typescript-with-jest/56045577#56045577) too.

Kudos to them, not all heroes wear capes!

*****

### Test Setup

Once again, I am using my favorite API for the demo purpose: the free [DOG Api](https://dog.ceo/dog-api/).

Let’s then agree that our goal is to create a test for the following service which does not do much beside fetching a random dog but note that I explicitly marked the query function as a `private` method for demonstration purpose.

```javascript
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface DogResponse {
    message: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class DoggosService {

    constructor(private httpClient: HttpClient) {
    }

    async findDoggo(): Promise<string | null> {
        const response: DogResponse = await this.searchDoggos();

        if (!response) {
            return null;
        }

        return response.message;
    }

    private searchDoggos(): Promise<DogResponse> {
        const url = 'https://dog.ceo/api/breeds/image/random';
        return this.httpClient.get<DogResponse>(url).toPromise();
    }
}
```

*****

### Failing Unit Test

Before trying to mock our private function, I thought that writing a test which fails would be a good start.

```javascript
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {DoggosService} from './doggos.service';

describe('DoggosService', () => {
    let httpTestingController: HttpTestingController;
    let service: DoggosService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(DoggosService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch a doggo', async () => {
        const mockUrl = 'https://images.dog.ceo/breeds/setter-irish/n02100877_1965.jpg';
        const data: string | null = await service.findDoggo();

        expect(data).not.toBe(null);
        expect(data).toEqual(mockUrl);
    });
});
```

Because we are performing an HTTP request and are not mocking it, the test fails on a timeout. That’s why our goal will be to solve this issue while mocking the `private` function which takes care of performing the request.

![](https://cdn-images-1.medium.com/max/1600/1*d2u_KJrrxiKqi-HKgsTfFw.png)

*****

### Mock A Private Function With Jasmine

To mock a private function with Jasmine, we can spy on our service private function `searchDoggos` and use a fake callback, `callFake` , to provide the mocked data as return when needed. Moreover, we can also test that our function has effectively been executed.

```javascript
it('should fetch a doggo', async () => {
    const mockUrl = 
    'https://images.dog.ceo/breeds/setter-irish/n02100877_1965.jpg';

    const handleSpy = spyOn(DoggosService.prototype as any, 
                            'searchDoggos');
    handleSpy.and.callFake(() => {
        return new Promise((resolve) => {
            resolve({
                message: mockUrl,
                status: 'success'
            });
        });
    });

    const data: string | null = await service.findDoggo();

    expect(data).not.toBe(null);
    expect(data).toEqual(mockUrl);

    expect(handleSpy).toHaveBeenCalled();
});
```

Thanks to these changes, we are now able to run our test with success 🥳.

![](https://cdn-images-1.medium.com/max/1600/1*072z86Cn9K5wz_1U4d0D9Q.png)

*****

### Mock A Private Function With Jest

The Jest solution follow the same logic as the above one except that we take advantages of the `mockImplementation` method to mock the private function.

```javascript
it('should fetch a doggo', async () => {
    const mockUrl = 
    'https://images.dog.ceo/breeds/setter-irish/n02100877_1965.jpg';

    const handleSpy = jest.spyOn(DoggosService.prototype as any, 
                                 'searchDoggos');
    handleSpy.mockImplementation(() => {
        return new Promise(resolve =>
            resolve({
                message: mockUrl,
                status: 'success'
            })
        );
    });

    const data: string | null = await service.findDoggo();

    expect(data).not.toBe(null);
    expect(data).toEqual(mockUrl);

    expect(handleSpy).toHaveBeenCalled();
});
```

*****

### Summary

Even though it looks really trivial once summarized, it took me a bit of time to find these solutions and I am really grateful that both Brian and jurl posted their answers on Stackoverflow. Hopefully this might help someone some day too!

Stay home, stay safe!

David

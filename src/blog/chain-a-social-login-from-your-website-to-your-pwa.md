---
path: "/blog/chain-a-social-login-from-your-website-to-your-pwa"
date: "2018-09-20"
title: "Chain a social login from your website to your PWA"
description: "Chain a social login from your website to your PWA"
tags: "#angular #pwa #login #authentication"
image: "https://daviddalbusco.com/assets/images/1*IXO653m7EDs58poOsnn5cg.gif"
---

![](https://daviddalbusco.com/assets/images/1*IXO653m7EDs58poOsnn5cg.gif)

Great news, after having open-sourced my mobile and progressive web app [Fluster](https://fluster.io/) last week, I follow up my move by releasing today my website on [GitHub](https://github.com/fluster/fluster-website) 🎉

Beside maybe the fact that this website is build with Angular, run as a server-side rendered app (SSR) and contains a simple blog based on [markdown files](https://dev.to/daviddalbusco/add-a-blog-to-your-angular-website-using-markdown-files-go7), it looks probably pretty common. But, if you give it a second chance, you might notice, I hope, something interesting: this website offers its users the ability to perform a login with their social accounts, Google or Facebook, and to jump afterwards directly to my progressive web app 😋

### Social login flows with a PWA

You may ask yourself how to implement social login in PWA? I won’t cover that particular subject in this article, but if needed, to point you in the right direction, I have implemented an “[OpenID connect](https://developers.google.com/identity/protocols/OpenIDConnect)” flow for the Google login and a “[manual login flow](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/)” for the Facebook one.

The idea beside these two flows, is to redirect the users, after they successfully logged themselves in their social accounts, to our application with temporary tokens in order to to validate and to complete the process with our backend.

### Chaining a social login from a website to a PWA

The challenge of such a login flow is that it has to happens between two different applications (the website and the PWA). Furthermore, to add just a bit of complexity, both applications might be served in two different subdomains. I’ll try to explain and display how it could be solve easily with the example of a Google login flow.

#### Website

First, the easy part, we add a button to our website:

```
<button (click)="googleLogin()">Log me in with Google</button>
```

Then we implement the function `googleLogin()` which does the following:

- It generates a random `state` to identify the login flow
- Writes this `state` in a cookie (which should be available across our
  subdomains)
- It finally redirects the user to her/his social account

```
constructor(@Inject(DOCUMENT) private document: Document) {

}

googleLogin() {

  const state = this.generateRandomString(16);
  const url = 'https://accounts.google.com/o/oauth2/v2/auth?';
  const webClientId = 'my-google-web-client-id';
  // The redirect url to be called after a successful login
  const pwaUrl = 'https://m.mydomain.com/';
  // First we save the state in a cookie
  this.writeCookieState(state, true).then(() => {
     // Then we build our social login url
     const googleUrl: string = url + 'client_id='
     + webClientId +
 '&response_type=code&scope=openid%20profile%20email&redirect_uri='
         + encodeURIComponent(pwaUrl)
         + '&nonce=' + state + '&state=' + state;
     // And we redirect the user to his google account
     this.document.location.href = googleUrl;
});

private writeCookieState(state: string, googleAuth: boolean)
        : Promise<{}> {

  return new Promise((resolve) => {

 // Note here the specific domain beginning with a point
// That’s one of the key in order to be able to read the cookie from the subdomain
    const baseDomain = '.mydomain.com’;
    const expireAfter: Date =
          moment(new Date()).add(5, 'm’).toDate();

    this.document.cookie = 'Our_state={"state":"' + state + '", "googleAuth": ' + googleAuth + '}; expires=' + expireAfter + '; domain=' + baseDomain + '; path=/’;

    resolve();
  });

}
generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
}
```

Good, nothing much to do in our website. We reached the point where we saved the `state` in a cookie and we redirected the user to her/his social account. Once successfully logged in, she/he will be redirected again but this time to our other application because we provided as parameter a redirection URL, not to our website, but to our PWA.

#### Progressive Web App

I will not go to deep in details about how to validate and complete the login flow in the PWA, but here are the key points regarding the particular subject of this article which I did implement in my app build with [Ionic](https://ionicframework.com/):

1.  The redirection to our PWA will happens with an url containing a `code` and a `state` as parameters. To catch these information, we could intercept them in `app.component.ts` and save them in a provider:

```
ngOnInit() {
    const state: string = this.platform.getQueryParam('state');
    const code: string = this.platform.getQueryParam('code');

    this.loginService.setState(state);
    this.loginService.setCode(code);
}
```

2. Once our PWA is fully loaded, we could start automatically the login process.
   Before displaying some codes, here a summary of what we are going to do:

- First we will check if a `state` and a `code` have been read and added to our
  provider
- Then we will try to retrieve the `state` we previously saved in the cross-domain
  cookie
- Finally we will compare both states to validate the flow, respectively to
  validate the fact that the user who tries to log in is effectively the user who
  wants to log in

```
constructor(@Inject(DOCUMENT) private document: Document) {

}
private ionViewWillEnter() {
    const state: string = this.loginService.getState();
    const code: string = this.loginService.getCode();

    if (state && code) {
        const cookieState = this.getPwaLoginStateCookie();

        if (cookieState && state === cookieState.state) {
           // All good, we could do the login
           this.doPwaLoginAndNavigate(cookiePwaLoginState, code);
        }
    }
}
private getPwaLoginStateCookie(): any {
    if (!this.document.cookie) {
        return null;
    }

    const cookies: RegExpExecArray =
       RegExp('Our_state' + '[^;]+').exec(this.document.cookie);

    if (!cookies) {
        return null;
    }
    const cookie: string = decodeURIComponent(!!cookies ? cookies.toString().replace(/^[^=]+./, '') : '');

    if (!cookie || cookie.indexOf('state') === -1) {
        return null;
    }

    return JSON.parse(cookie);
}
```

Voilà, we were able to chain a login flow from our website to our PWA 😇

### Cherry on the cake 🍒🎂

As I said in my introduction, [Fluster](https://fluster.io/) is open source, therefore, if the above code samples are a bit hard to swallow, just clone my [website](https://github.com/fluster/fluster-website) and [app](https://github.com/fluster/fluster-app). It will be, I hope, easier to follow once you have opened them in your favorite editor 😉

To infinity and beyond 🚀

David

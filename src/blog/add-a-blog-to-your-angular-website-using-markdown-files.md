---
path: "/blog/add-a-blog-to-your-angular-website-using-markdown-files"
date: "2018-09-07"
title: "Add a blog to your Angular website using markdown files"
description: "Add a blog to your Angular website using markdown files"
tags: "#angular #markdown #blog"
image: "https://daviddalbusco.com/assets/images/1*MTFh-iQIpiz6mfzB93SWkA.jpeg"
---

![](https://daviddalbusco.com/assets/images/1*MTFh-iQIpiz6mfzB93SWkA.jpeg)

Last week I wanted to add a blog to my [Angular](https://angular.io/) Universal website, but I didn’t wanted to implement a complex solution and spend to much time on it. Neither did I wanted to add a CMS or even store the articles in a database. That’s why I came up, I think, with a pretty handy, for not saying dumb simple, solution with the implementation of a blog based on [markdown](https://en.wikipedia.org/wiki/Markdown) files 🚀

_Before going further: If you are looking to implement a blog, you are looking to share your stories but you are also most probably looking to make your website more SEO friendly. Therefore, I assume that you already have implemented an [Angular SSR](https://github.com/angular/universal-starter) website. If not, I would really advise you to have a look to that particular topic and if you do have, don’t miss the very last chapter of this article, a kind of hack is needed in order to load the resources correctly on the backend side_

### Installation

The only required extra library we will need to implement the solution is [ngx-markdown](https://github.com/jfcere/ngx-markdown) of [Jean-Francois Cere (https://github.com/jfcere). It will add the markdown support to our website respectively this awesome library will do all the job for us, it will read the markdown files and parse them to html 💪😃

```
npm install ngx-markdown --save
```

### Content

As I said above, the idea is to use markdown files as sources for the blog. In this solution I ship the files within the app, placing them under the `assets` folder

- assets > blog > blog.md: the list of blog entries
- assets > blog > post > \*.md: the articles (= blog posts) themselves

### Routes

For this solution we will need to add two routes to our website

- A route “/blog” which will display a list of all articles
- A route “/blog/post/name-of-the-article” which will display a particular blog post. In this route example the blog post name is “name-of-the-article”

I did group all routes under the same “blog” path, therefore the structure will look like the following once implemented

![](https://daviddalbusco.com/assets/images/1*K_WltAXjubVdyXWMUN7Tmg.png)

### Implementation

First of all, we create a main `blog.module.ts` which will route the submodules and import the markdown library

```
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', pathMatch: 'full',
               loadChildren: './blog/blog-view.module#BlogViewModule'},
      {path: 'post',
               loadChildren: './post/blog-post-view.module#BlogPostViewModule'},
    ]),
    MarkdownModule.forRoot()
  ]
})
```

#### Blog

Now we could create the `blog-view` which will display the list of blog entries with the help of the Angular cli. To the default moduleswe only have to add the import of the markdown module

```
@NgModule({
  declarations: [BlogViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BlogViewComponent}
    ]),
    ComponentsModule,
    MarkdownModule.forChild()
  ]
})
```

Finally, we could add a markdown directive to our template `blog view.component.html` which will automatically load and display the content of the markdown file, told you it’s super easy 😂

```
<div markdown [src]="'./assets/blog/blog.md'"></div>
```

As you could notice, the directive reference the `blog.md` file which just consists of the list of entries (one title, subtitle and author per blog post) and relative urls which will be used for the navigation

```
##  [Title](/blog/post/name-of-the-article)
### [Subtitle](/blog/post/name-of-the-article)
Posted by [David](mailto:david@fluster.io) on September 6, 2018
```

### Post

Now that our `blog-view` is ready, we could add our `blog-post-view`. As we did previously we need to add `MarkdownModule.forChild()` to the module but we also need to define the parameter of the route (‘:id’) which will allow us to retrieve the post to load, because here comes the trick: **the post route take as parameter the name of the post we want to display respectively the name of the markdown file to load. **So let’s say in our example that we want to display the blog post `assets > blog > post > name-of-the-article.md` our route will look like `/blog/post/name-of-the-article`

```
@NgModule({
  declarations: [BlogPostViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BlogPostViewComponent},
      { path: ':id', component: BlogPostViewComponent, pathMatch: 'full'}
    ]),
    ComponentsModule,
    MarkdownModule.forChild()
  ]
})
```

Once done, we could again add the directive to our template, this time we are not going to reference a particular file but rather use a variable name `post`

```
<div markdown [src]="post"></div>
```

I guess you understood, since we are using a route parameter, we have to
initialize this variable using the interface `ActivatedRoute`

```
@Component({
  selector: 'app-blog-post-view',
  styleUrls: ['./blog-post-view.component.scss'],
  templateUrl: './blog-post-view.component.html'
})
export class BlogPostViewComponent implements OnInit, OnDestroy {

  private sub: Subscription;

  post: string;

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.post = './assets/blog/post/' +  params['id'] + '.md';
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
```

Et voilà, that’s it, nothing more nothing left in order to route, load and display our blog 👍

Of course the solution would probably need a bit of styling, I won’t cover that in this article but if you are using [Bootstrap](https://getbootstrap.com/) you could for example have a look to this [free clean blog theme (https://startbootstrap.com/template-overviews/clean-blog/)

Once implemented and styled our blog could look like the one I have implemented 👉 [https://fluster.io/blog](https://fluster.io/blog)

### Cherry on the cake 🍒🎂

I realized it afterwards, but you know what’s the cherry on the cake of this solution? You could easily export you Medium stories as markdown (for example with this [Chrome extension](https://chrome.google.com/webstore/detail/convert-medium posts-to-m/aelnflnmpbjgipamcogpdoppjbebnjea)) and therefore integrate them quickly in the blog we just created 🎉

### Bonus hack 🤖

While developing this blog solution I faced the problem that `ngx-markdown` was not able to load the markdown files, from the assets folder using relative paths and the `HttpClientModule` , on the server side of my Angular Universal app which ultimately would have had for effect that such content would have been ignored by crawlers 😢 Prior to Angular v6 I would have solved this by loading resources directly from the filesystem (using`fs` ) but unfortunately this isn’t possible anymore. Fortunately 😅 I found the following discussion and issue [https://github.com/angular/universal/issues/858](https://github.com/angular/universal/issues/858) which allowed my to solve the problem

In order to help our Angular Universal server to load correctly the resources we need for `ngx-markdown`, the idea is to intercept all Http requests with the goal to rewrite them with an understandable server side host path. Not rocket science but definitely a must have for our implementation of a friendly SEO blog based on markdown files

```
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {isPlatformServer} from '@angular/common';

import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformServer(this.platformId) && req.url.includes('./')) {
      return next.handle(req.clone({
        url: `http://localhost:8000/${req.url.replace('./', '')}`
      }));
    }

    return next.handle(req);
  }
}
```

Have fun blogging 🤓

To infinity and beyond 🚀

David

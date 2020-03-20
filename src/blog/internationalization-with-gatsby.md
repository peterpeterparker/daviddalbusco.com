---
path: "/blog/internationalization-with-gatsby"
date: "2020-03-20"
title: "Internationalization with Gatsby"
description: "How to internationalize your Gatsby website with gatsby-plugin-i18n and react-intl in 2020"
tags: "#javascript #webdev #a11y #tutorial"
image: "https://cdn-images-1.medium.com/max/1600/1*tuOyAQ0r1d4nnAcA1xccyQ.png"
canonical: "https://medium.com/@david.dalbusco/internationalization-with-gatsby-ae3991c39e92"
---

![](https://cdn-images-1.medium.com/max/1600/1*tuOyAQ0r1d4nnAcA1xccyQ.png)

*Photo by [Nicola Nuttall](https://unsplash.com/@nicnut?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

I [challenged](https://daviddalbusco.com/blog/how-to-call-the-service-worker-from-the-web-app-context) my self to share a blog post every day until the end of the COVID-19 quarantine in Switzerland, the 19th April 2020. **Thirty** days left until hopefully better days.

*****

We are starting a new project with two friends, can’t tell much yet about it at this point, but let’s just say for the moment that it aligns our values. For its purpose we need a website which, obviously, is going to be open source and which I’m going to develop with [Gatsby](https://www.gatsbyjs.org).

Even though it is not my first Gatsby’s site, my [personal website](https://daviddalbusco.com) is developed with the same stack, this is the first time I have to internationalize one.

I expected such implementation to be fairly straight forward but between light documentations, outdated blog posts or even sample projects, it turned out that I actually had to invest two hours this morning to finally achieve my goal.

That’s why I thought that sharing the outcome in this new tutorial might be a good idea.

*****

### SEO Friendly Plugin

Your good old friend need different URLs (routes) to crawl and render your pages for each language. For example, if your website supports English and French, Google is going to be happy if you provide `https://domain.com/en/` and `https://domain.com/fr/` .

To achieve this with Gatsby, the first thing **important** to have in mind is that all your pages have to be duplicated. To follow above example, that would mean that the website would contains both an `index.en.js` page and an `index.fr.js` one.

To help our website understand such routing, we can use the plugin [gatsby-plugin-i18n](https://github.com/angeloocana/gatsby-plugin-i18n).

```bash
npm install gatsby-plugin-i18n —-save
```

Once installed, we add its required configuration in `gatsby-config.js` and also add some meta information about the list of supported languages and the default one.

Note that I specified `prefixDefault` to true in order to use no root routing, even URLs for the default language, English, will have to be prefixed with `/en/` . To be perfectly honest with you, one of the reason behind this is also the fact that I was unable to make it happens otherwise 😅.

```json
siteMetadata: {
  languages: {
    langs: ['en', 'fr'],
    defaultLangKey: 'en'
  }
},
plugins: [
  {
    resolve: 'gatsby-plugin-i18n',
    options: {
      langKeyDefault: 'en',
      useLangKeyLayout: true,
      prefixDefault: true
    }
  }
]
```

Because we are using a prefix in any case, without any other change, accessing the root of our website will display nothing, that’s why we edit `gatsby-browser.js` to redirect the root requests to the default home page.

```javascript
exports.onClientEntry = () => {
  if (window.location.pathname === '/') {
    window.location.pathname = `/en`
  }
}
```

*****

### Internationalization Library

Gatsby and the above plugin are either compatible with [react-i18next](https://react.i18next.com) or [react-intl](https://github.com/formatjs/react-intl). I use i18next in [Tie Tracker](https://tietracker.app.link/), therefore I went with the other solution because I like to learn new things. React Intl relies on the `Intl` APIs, that’s why we are also installing the polyfill [intl-pluralrules](https://www.npmjs.com/package/@formatjs/intl-pluralrules).

```bash
npm install react-intl @formatjs/intl-pluralrules --save
```

*****

### Hands-on Coding

Enough installation and configuration, let’s code. The major modification which we have to apply occurs in `layout.js` , which by the way, I moved in a subfolder `src/components/layout/` for no other particular reason that the fact that I like clean structure.

What happens here you may ask? Summarized, we are adding two new required properties, `location` and `messages` . The first one is use to guess the locale which should be applied and the second one contains the list of translations. As you can notice we import React Intl and we do also import a function `getCurrentLangKey` from `ptz-i18n` which is actually a utility of the above plugin.

I’m also using the `<FormattedMessage/>` component to print out an `Hello World` to ensure that our implementation works out.

```javascript
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "../header"
import "./layout.css"

import { FormattedMessage, IntlProvider } from "react-intl"
import "@formatjs/intl-pluralrules/polyfill"

import { getCurrentLangKey } from 'ptz-i18n';

const Layout = ({ children, location, messages }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          languages {
            defaultLangKey
            langs
          }
        }
      }
    }
  `)

  const { langs, defaultLangKey } = 
                                data.site.siteMetadata.languages;
  const langKey = 
     getCurrentLangKey(langs, defaultLangKey, location.pathname);

  return (
    <IntlProvider locale={langKey} messages={messages}>
      <Header siteTitle={data.site.siteMetadata.title} />

      <p>
        <FormattedMessage id="hello" />
      </p>

    </IntlProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.node.isRequired,
  messages: PropTypes.node.isRequired,
}

export default Layout
```

To “extend” the layout for each language and locale, we create a new file per supported languages. For example, in English, we create `layout/en.js` in which we import both our custom messages and the specific polyfill.

```javascript
import React from 'react';
import Layout from "./layout"

import messages from '../../i18n/en';
import "@formatjs/intl-pluralrules/dist/locale-data/en"

export default (props) => (
  <Layout
    {...props}
    messages={messages}
  />
);
```

At this point, our code won’t compile because these languages, these messages are missing. That’s why we also create the file for these, for example `i18n/en.js` .

```javascript
module.exports = {
  hello: "Hello world",
}
```

As I briefly staten in my introduction, each page is going to be duplicated. That’s why we create the corresponding index page. In case of the default, English, we rename `index.js` to `index.en.js` . Moreover, because the layout now expect a location property, we pass it from every pages too.

Note also that, because I have decided to prefix all route, I also modifed the link routing from `/page-2/` to `/en/page-2` .

```javascript
import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout/en"
import SEO from "../components/seo/seo"

const IndexPage = (props) => (
  <Layout location={props.location}>
    <SEO />
    <h1>Hi people</h1>
    
    <Link to="/en/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
```

The same modifications we have implemented for `index` should be propagated to every pages, in this example, I also rename `page-2.js` in `page-2.en.js` and apply the same modifications as above.

```javascript
import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout/en"
import SEO from "../components/seo/seo"

const SecondPage = (props) => (
  <Layout location={props.location}>
    <SEO title="Page two" />
    <p>Welcome to page 2</p>
    <Link to="/en/">Go back to the homepage</Link>
  </Layout>
)

export default SecondPage
```

Identically, the usage of the `<Layout/>` component has to be enhanced with the location object in our `404.js` page.

```javascript
import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

const NotFoundPage = (props) => (
  <Layout location={props.location}>
    <SEO />
    <h1>NOT FOUND</h1>
  </Layout>
)

export default NotFoundPage
```

And voilà, that’s it, our Gastby site is internationalized 🎉. Of course you might want to add some other languages, to do so, repeat the above English steps and again, duplicate pages.

*****

### Summary

Well it was really unexpected to me to have had to spend so much time to unleash internationalization in a new project, that’s why I hope that this small “how to” might help anyone in the future. And as always, if you notice anything which can be improved, don’t hesitate to ping me with a comment or a [tweet](https://twitter.com/daviddalbusco).

Stay home, stay safe!

David

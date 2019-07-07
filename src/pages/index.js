import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import Header from "../components/header/header"
import Portfolio from "../components/portfolio/portfolio"
import Blog from "../components/blog/blog"
import About from "../components/about/about"
import Contact from "../components/contact/contact"

import { library } from "@fortawesome/fontawesome-svg-core"

import { faRobot } from "@fortawesome/pro-light-svg-icons"
import { faSuitcase } from "@fortawesome/pro-light-svg-icons"
import { faNewspaper } from "@fortawesome/pro-light-svg-icons"
import { faAddressCard } from "@fortawesome/pro-light-svg-icons"
import { faEnvelope } from "@fortawesome/pro-light-svg-icons"
import { faBars } from "@fortawesome/pro-light-svg-icons"

import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faMedium } from "@fortawesome/free-brands-svg-icons"
import { faDev } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons"

import { defineCustomElements as deckdeckgoLazyImgLoader } from "@deckdeckgo/lazy-img/dist/loader"
import { defineCustomElements as deckdeckgoCoreLoader } from "@deckdeckgo/core/dist/loader"

deckdeckgoLazyImgLoader(window)
deckdeckgoCoreLoader(window)

library.add(faRobot)
library.add(faSuitcase)
library.add(faNewspaper)
library.add(faAddressCard)
library.add(faEnvelope)
library.add(faBars)

library.add(faGithub)
library.add(faMedium)
library.add(faDev)
library.add(faTwitter)
library.add(faLinkedinIn)

const IndexPage = () => (
  <Layout fixNav={false}>
    <SEO/>
    <Header/>
    <Portfolio/>
    <About/>
    <Blog/>
    <Contact/>
  </Layout>
)

export default IndexPage

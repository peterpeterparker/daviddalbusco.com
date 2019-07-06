import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import Header from "../components/header/header"
import Portfolio from "../components/portfolio/portfolio"
import Blog from "../components/blog/blog"

import { library } from "@fortawesome/fontawesome-svg-core"
import { faRobot } from "@fortawesome/pro-light-svg-icons"
import { faSuitcase } from "@fortawesome/pro-light-svg-icons"
import { faNewspaper } from "@fortawesome/pro-light-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faMedium } from "@fortawesome/free-brands-svg-icons"
import { faDev } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons"

library.add(faRobot)
library.add(faSuitcase)
library.add(faNewspaper)
library.add(faGithub)
library.add(faMedium)
library.add(faDev)
library.add(faTwitter)
library.add(faLinkedinIn)

const IndexPage = () => (
  <Layout>
    <SEO title='Home'/>
    <Header/>
    <Portfolio/>
    <Blog/>
  </Layout>
)

export default IndexPage

import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import { library } from "@fortawesome/fontawesome-svg-core"
import { faRobot } from "@fortawesome/pro-light-svg-icons"
import { faSuitcase } from "@fortawesome/pro-light-svg-icons"
import { faNewspaper } from "@fortawesome/pro-light-svg-icons"

import Header from "../components/header/header"
import Portfolio from "../components/portfolio/portfolio"
import Blog from "../components/blog/blog"

library.add(faRobot)
library.add(faSuitcase)
library.add(faNewspaper)

const IndexPage = () => (
  <Layout>
    <SEO title='Home'/>
    <Header/>
    <Portfolio/>
    <Blog/>
  </Layout>
)

export default IndexPage

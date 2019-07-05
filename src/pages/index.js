import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout/layout"
import Image from "../components/image/image"
import SEO from "../components/seo/seo"

import { library } from "@fortawesome/fontawesome-svg-core"
import { faRobot } from "@fortawesome/pro-light-svg-icons"

import Header from "../components/header/header"
import Portfolio from "../components/portfolio/portfolio"

library.add(faRobot)

const IndexPage = () => (
  <Layout>
    <SEO title='Home'/>
    <Header/>
    <Portfolio/>
    <main>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image/>
      </div>
      <Link to='/page-2/'>Go to page 2</Link>
    </main>
  </Layout>
)

export default IndexPage

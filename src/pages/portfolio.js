import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"

import Projects from "../components/projects/projects"

class Portfolio extends React.Component {

  render() {
    return <Layout fixNav={true}>
      <SEO title="Portfolio" />

      <Projects all={true}/>

    </Layout>
  }
}

export default () => (
  <Portfolio/>
)

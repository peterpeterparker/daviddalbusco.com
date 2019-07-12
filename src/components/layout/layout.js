/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { graphql, StaticQuery } from "gatsby"

import "../../theme/variables.scss"
import "../../theme/main.scss"
import "../../theme/section.scss"
import "../../theme/blog.scss"
import "../../theme/project.scss"
import "../../theme/input.scss"
import "../../theme/theme.scss"

import Navigation from "../navigation/navigation"
import Footer from "../footer/footer"

class Layout extends React.Component {

  async componentDidMount() {
    // TODO: To be removed when https://github.com/ionic-team/stencil/issues/1724 will be solved
    // Use import instead when solved
    try {
      const deckdeckgoLazyImgLoader = require("@deckdeckgo/lazy-img/dist/loader")
      const deckdeckgoCoreLoader = require("@deckdeckgo/core/dist/loader")

      await deckdeckgoLazyImgLoader.defineCustomElements(window)
      await deckdeckgoCoreLoader.defineCustomElements(window)
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return <>
      <Navigation siteTitle={this.props.data.site.siteMetadata.title} fix={this.props.fixNav}/>
      {this.props.children}
      <Footer/>
    </>
  }

}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ({ children, fixNav }) => (
  <StaticQuery
    query={graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `}
    render={(data) => (
      <Layout data={data} fixNav={fixNav}>
        {children}
      </Layout>
    )}
  />
)

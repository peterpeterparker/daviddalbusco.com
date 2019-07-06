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
import "../../theme/input.scss"
import "../../theme/theme.scss"

import Navigation from "../navigation/navigation"
import Footer from "../footer/footer"

class Layout extends React.Component {

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

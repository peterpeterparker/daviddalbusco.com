import React from "react"

import "./header.scss"

import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class Header extends React.Component {

  render() {
    return <section className="header">
      <div className="container">
        <Img fluid={this.props.data.placeholderImage.childImageSharp.fluid}/>

        <h1>David Dal Busco</h1>

        <div className="divider">
          <div></div>

          <FontAwesomeIcon icon={["fal", "robot"]} size="2x"/>

          <div></div>
        </div>

        <p>{this.props.data.site.siteMetadata.description}</p>
      </div>
    </section>
  }
}

export default () => (
  <StaticQuery
    query={graphql`
    query {
      placeholderImage: file(relativePath: { eq: "daviddalbusco.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 480) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      site {
        siteMetadata {
          description
        }
      }
    }
  `}
    render={(data) => (
      <Header data={data}/>
    )}
  />
)

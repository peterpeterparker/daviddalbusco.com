import React from "react"

import "./header.scss"

import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

import Chapter from "../chapter/chapter"

class Header extends React.Component {

  render() {
    return <section className="header">
      <main>
        <Img fluid={this.props.data.placeholderImage.childImageSharp.fluid}/>

        <Chapter icon="robot">
          <h1>David Dal Busco</h1>
        </Chapter>

        <p>{this.props.data.site.siteMetadata.description}</p>
      </main>
    </section>
  }
}

export default () => (
  <StaticQuery
    query={graphql`
    query {
      placeholderImage: file(relativePath: { eq: "daviddalbusco.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 260) {
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

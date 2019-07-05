import React from "react"

import "./portfolio.scss"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Portfolio = () => {
  const data = useStaticQuery(graphql`
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
  `)

  return <section>
    <div className="container">
      <Img fluid={data.placeholderImage.childImageSharp.fluid}/>

      <h1>David Dal Busco</h1>

      <div className="divider">
        <div></div>

        <FontAwesomeIcon icon={['fal', 'robot']} size="2x" />

        <div></div>
      </div>

      <p>{data.site.siteMetadata.description}</p>
    </div>
  </section>
}

export default Portfolio

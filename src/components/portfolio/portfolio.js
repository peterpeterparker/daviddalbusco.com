import React from "react"

import "./portfolio.scss"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

const Portfolio = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "daviddalbusco.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return <section>
    <Img fluid={data.placeholderImage.childImageSharp.fluid} />

    <h1>David Dal Busco</h1>
  </section>
}

export default Portfolio

import React from "react"

import "./portfolio.scss"
import { graphql, StaticQuery } from "gatsby"

class Portfolio extends React.Component {

  render() {
    return <section className="portfolio">
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
      }
    }
  `}
    render={(data) => (
      <Portfolio data={data}/>
    )}
  />
)

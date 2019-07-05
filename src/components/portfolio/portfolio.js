import React from "react"

import { graphql, StaticQuery } from "gatsby"
import "./portfolio.scss"

import Chapter from "../chapter/chapter"

class Portfolio extends React.Component {

  render() {
    return <section className="portfolio">
      <main>
        <Chapter icon="suitcase">
          <h2>Portfolio</h2>
        </Chapter>
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

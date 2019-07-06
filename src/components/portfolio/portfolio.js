import React from "react"

import { graphql, StaticQuery } from "gatsby"
import "./portfolio.scss"

import Chapter from "../chapter/chapter"
import Img from "gatsby-image"

class Portfolio extends React.Component {

  render() {
    return <section className="portfolio extraspace">
      <main>
        <Chapter icon="suitcase">
          <h2>Portfolio</h2>
        </Chapter>

        <div className="projects">
          <article  className="ourenergy">
            <div className="summary">
              <Img fluid={this.props.data.ourEnergyImage.childImageSharp.fluid}/>
            </div>

            <div className="details">
              <h2>Our Energy - ETH Zürich</h2>

              <p>Details</p>
            </div>
          </article>

          <article className="deckdeckgo">
            <div className="summary">
              <Img fluid={this.props.data.deckDeckGoImage.childImageSharp.fluid}/>
            </div>

            <div className="details">
              <h2>DeckDeckGo</h2>

              <p>Details</p>
            </div>
          </article>

          <article className="fluster">
            <div className="summary">
              <Img fluid={this.props.data.flusterImage.childImageSharp.fluid}/>
            </div>

            <div className="details">
              <h2>Fluster</h2>

              <p>Details</p>
            </div>
          </article>
        </div>
      </main>
    </section>
  }
}

export default () => (
  <StaticQuery
    query={graphql`
    query {
      ourEnergyImage: file(relativePath: { eq: "portfolio/ourenergy-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      deckDeckGoImage: file(relativePath: { eq: "portfolio/deckdeckgo-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      flusterImage: file(relativePath: { eq: "portfolio/fluster-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
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

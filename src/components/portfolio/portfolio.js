import React from "react"

import { graphql, StaticQuery, Link } from "gatsby"
import "./portfolio.scss"

import Chapter from "../chapter/chapter"
import Img from "gatsby-image"

import { DeckDeckGoUtils } from "@deckdeckgo/utils"


class Portfolio extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mobile: false,
    }
  }

  componentDidMount() {
    this.setState({mobile: DeckDeckGoUtils.isMobile()})
  }

  render() {
    return <section className="portfolio extraspace" id="portfolio">
      <main>
        <Chapter icon="suitcase">
          {this.renderTitle()}
        </Chapter>

        <div className="projects">
          {this.renderOurEnergy()}

          {this.renderBonjour()}

          {this.renderDeckDeckGo()}

          {this.renderFluster()}
        </div>
      </main>
    </section>
  }

  renderTitle() {
    if (!this.props || !this.props.filter || this.props.filter === undefined || this.props.filter === "") {
      return <h2>Portfolio</h2>
    } else {
      return <h2>Other projects</h2>
    }
  }

  renderOurEnergy() {
    if (!this.props || this.props.filter !== "ourenergy") {
      return <Link to="/portfolio/our-energy-eth-zurich">
        <article className={this.state.mobile ? "ourenergy mobile" : "ourenergy"}>
          <div className="summary">
            <Img fluid={this.props.data.ourEnergyImage.childImageSharp.fluid}/>

            <h3>Our Energy - ETH Zürich</h3>
          </div>

          <div className="details">
            <h2>Our Energy - ETH Zürich</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderBonjour() {
    if (!this.props || this.props.filter !== "bonjour") {
      return <Link to="/portfolio/bonjour">
        <article className={this.state.mobile ? "bonjour mobile" : "bonjour"}>
          <div className="summary">
            <Img fluid={this.props.data.bonjourImage.childImageSharp.fluid}/>

            <h3>Bonjour</h3>
          </div>

          <div className="details">
            <h2>Bonjour</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderDeckDeckGo() {
    if (!this.props || this.props.filter !== "deckdeckgo") {
      return <Link to="/portfolio/deckdeckgo">
        <article className={this.state.mobile ? "deckdeckgo mobile" : "deckdeckgo"}>
          <div className="summary">
            <Img fluid={this.props.data.deckDeckGoImage.childImageSharp.fluid}/>

            <h3>DeckDeckGo</h3>
          </div>

          <div className="details">
            <h2>DeckDeckGo</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderFluster() {
    if (!this.props || this.props.filter !== "fluster") {
      return <Link to="/portfolio/fluster">
        <article className={this.state.mobile ? "fluster mobile" : "fluster"}>
          <div className="summary">
            <Img fluid={this.props.data.flusterImage.childImageSharp.fluid}/>

            <h3>Fluster</h3>
          </div>

          <div className="details">
            <h2>Fluster</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }
}

export default ({ filter }) => (
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
      bonjourImage: file(relativePath: { eq: "portfolio/bonjour-icon.png" }) {
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
      <Portfolio data={data} filter={filter}/>
    )}
  />
)

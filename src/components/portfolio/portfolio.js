import React from "react"

import { graphql, StaticQuery, Link } from "gatsby"
import "./portfolio.scss"

import Chapter from "../chapter/chapter"
import Img from "gatsby-image"

import {isMobile} from "@deckdeckgo/utils"

class Portfolio extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mobile: false,
    }
  }

  componentDidMount() {
    this.setState({mobile: isMobile()})
  }

  render() {
    return [<section className="portfolio extraspace" id="portfolio" key="portfolio">
      <main>
        <Chapter icon="suitcase">
          <h2>Portfolio</h2>
        </Chapter>

        <div className="projects">
          {this.renderOurEnergy()}

          {this.renderETHLibraryLab()}

          {this.renderBonjourCircle()}

          {this.renderBonjourBloom()}

          {this.renderDVB()}
        </div>
      </main>
    </section>,
    <section className="other-projects extraspace-bottom" id="other-projects" key="otherProjects">
      <main>
        <Chapter icon="pencil-ruler">
          <h2>Other projects</h2>
        </Chapter>

        <div className="projects">
          {this.renderDeckDeckGo()}

          {this.renderTieTracker()}

          {this.renderWooof()}

          {this.renderFluster()}
        </div>
      </main>
    </section>
    ]
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

  renderETHLibraryLab() {
    if (!this.props || this.props.filter !== "eth-library-lab") {
      return <Link to="/portfolio/eth-library-lab">
        <article className={this.state.mobile ? "eth-library-lab mobile" : "eth-library-lab"}>
          <div className="summary">
            <Img fluid={this.props.data.ethLibraryLabImage.childImageSharp.fluid}/>

            <h3>ETH Library Lab</h3>
          </div>

          <div className="details">
            <h2>ETH Library Lab</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderBonjourCircle() {
    if (!this.props || this.props.filter !== "bonjour-circle") {
      return <Link to="/portfolio/bonjour-circle">
        <article className={this.state.mobile ? "bonjour-circle mobile" : "bonjour-circle"}>
          <div className="summary">
            <Img fluid={this.props.data.bonjourCircleImage.childImageSharp.fluid}/>

            <h3>Bonjour - Circle</h3>
          </div>

          <div className="details">
            <h2>Bonjour - Circle</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderBonjourBloom() {
    if (!this.props || this.props.filter !== "bonjour-bloom") {
      return <Link to="/portfolio/bonjour-bloom">
        <article className={this.state.mobile ? "bonjour-bloom mobile" : "bonjour-bloom"}>
          <div className="summary">
            <Img fluid={this.props.data.bonjourBloomImage.childImageSharp.fluid}/>

            <h3>Bonjour - Bloom</h3>
          </div>

          <div className="details">
            <h2>Bonjour - Bloom</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderDVB() {
    if (!this.props || this.props.filter !== "dvb") {
      return <Link to="/portfolio/dvbern">
        <article className={this.state.mobile ? "dvb mobile" : "dvb"}>
          <div className="summary">
            <Img fluid={this.props.data.dvbImage.childImageSharp.fluid}/>

            <h3>DV Bern AG</h3>
          </div>

          <div className="details">
            <h2>DV Bern AG</h2>

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

  renderTieTracker() {
    if (!this.props || this.props.filter !== "tietracker") {
      return <Link to="/portfolio/tietracker">
        <article className={this.state.mobile ? "tietracker mobile" : "tietracker"}>
          <div className="summary">
            <Img fluid={this.props.data.tieTrackerImage.childImageSharp.fluid}/>

            <h3>Tie Tracker</h3>
          </div>

          <div className="details">
            <h2>Tie Tracker</h2>

            <p>Details</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined
    }
  }

  renderWooof() {
    if (!this.props || this.props.filter !== "wooof") {
      return <Link to="/portfolio/wooof">
        <article className={this.state.mobile ? "wooof mobile" : "wooof"}>
          <div className="summary">
            <Img fluid={this.props.data.wooofImage.childImageSharp.fluid}/>

            <h3>Wooof</h3>
          </div>

          <div className="details">
            <h2>Wooof</h2>

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
      ethLibraryLabImage: file(relativePath: { eq: "portfolio/eth-library-lab-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      bonjourCircleImage: file(relativePath: { eq: "portfolio/bonjour-circle-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      bonjourBloomImage: file(relativePath: { eq: "portfolio/bonjour-bloom-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      dvbImage: file(relativePath: { eq: "portfolio/dvb-icon.png" }) {
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
      wooofImage: file(relativePath: { eq: "portfolio/wooof-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 240) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      tieTrackerImage: file(relativePath: { eq: "portfolio/tietracker-icon.png" }) {
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

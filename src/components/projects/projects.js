import React from 'react';

import {graphql, StaticQuery, Link} from 'gatsby';

import Chapter from '../chapter/chapter';
import {GatsbyImage} from 'gatsby-plugin-image';

import './projects.scss';

import {isMobile} from '@deckdeckgo/utils';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: false,
    };
  }

  componentDidMount() {
    this.setState({mobile: isMobile()});
  }

  render() {
    return [
      <section className={`portfolio ${this.props && this.props.all ? 'extrabigspace' : 'extraspace'}`} id="portfolio" key="portfolio">
        <main>
          <Chapter icon="suitcase">
            <h2>Portfolio</h2>
          </Chapter>

          <div className="projects">
            {this.renderOurEnergy()}

            {this.renderOwlly()}

            {this.renderBonjourCircle()}

            {this.renderBonjourBloom()}

            {this.renderIneexa()}
          </div>
        </main>
      </section>,

      <section className="other-projects extraspace-bottom" key="extDeveloperProjects">
        <main>
          <Chapter icon="code">
            <h2>External developer & Consulting</h2>
          </Chapter>

          <div className="projects">
            {this.renderMobi()}

            {this.renderETHLibraryLab()}

            {this.renderDVB()}
          </div>
        </main>
      </section>,

      <section className="other-projects extraspace-bottom" key="sideProjects">
        <main>
          <Chapter icon="hat-wizard">
            <h2>Personal projects</h2>
          </Chapter>

          <div className={`projects ${!this.props || !this.props.all ? 'preview' : ''}`}>
            {this.renderDeckDeckGo()}

            {this.renderTieTracker()}

            {this.props && this.props.all ? this.renderDiscoverWeeklyDev() : undefined}

            {this.props && this.props.all ? this.renderFluster() : undefined}
          </div>

          {this.props && this.props.all ? undefined : (
            <Link to="/portfolio/" aria-label="Portfolio" className="button">
              <h2>And more</h2>
            </Link>
          )}
        </main>
      </section>,
      this.renderPrototypes(),
    ];
  }

  renderPrototypes() {
    if (!this.props || !this.props.all) {
      return undefined;
    }

    return (
      <section className="other-projects extraspace-bottom" key="otherProjects">
        <main>
          <Chapter icon="pencil-ruler">
            <h2>Other prototypes</h2>
          </Chapter>

          <div className="projects preview">
            {this.renderRebelScan()}

            {this.renderWooof()}

            {this.renderWatamato()}
          </div>

          {this.props && this.props.all ? undefined : (
            <Link to="/portfolio/" aria-label="Portfolio" className="button">
              <h2>And more</h2>
            </Link>
          )}
        </main>
      </section>
    );
  }

  renderOurEnergy() {
    if (!this.props || this.props.filter !== 'ourenergy') {
      return (
        <Link to="/portfolio/our-energy-eth-zurich" aria-label="Our Energy - ETH Zürich">
          <article className={this.state.mobile ? 'ourenergy mobile' : 'ourenergy'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.ourEnergyImage.childImageSharp.gatsbyImageData} />

              <h3>Our Energy - ETH Zürich</h3>
            </div>

            <div className="details">
              <h2>Our Energy - ETH Zürich</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderETHLibraryLab() {
    if (!this.props || this.props.filter !== 'eth-library-lab') {
      return (
        <Link to="/portfolio/eth-library-lab" aria-label="ETH Library Lab">
          <article className={this.state.mobile ? 'eth-library-lab mobile' : 'eth-library-lab'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.ethLibraryLabImage.childImageSharp.gatsbyImageData} />

              <h3>ETH Library Lab</h3>
            </div>

            <div className="details">
              <h2>ETH Library Lab</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderBonjourCircle() {
    if (!this.props || this.props.filter !== 'bonjour-circle') {
      return (
        <Link to="/portfolio/bonjour-circle" aria-label="Circle">
          <article className={this.state.mobile ? 'bonjour-circle mobile' : 'bonjour-circle'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.bonjourCircleImage.childImageSharp.gatsbyImageData} />

              <h3>Bonjour - Circle</h3>
            </div>

            <div className="details">
              <h2>Bonjour - Circle</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderBonjourBloom() {
    if (!this.props || this.props.filter !== 'bonjour-bloom') {
      return (
        <Link to="/portfolio/bonjour-bloom" aria-label="Bloom">
          <article className={this.state.mobile ? 'bonjour-bloom mobile' : 'bonjour-bloom'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.bonjourBloomImage.childImageSharp.gatsbyImageData} />

              <h3>Bonjour - Bloom</h3>
            </div>

            <div className="details">
              <h2>Bonjour - Bloom</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderDVB() {
    if (!this.props || this.props.filter !== 'dvb') {
      return (
        <Link to="/portfolio/dvbern" aria-label="DV Bern AG">
          <article className={this.state.mobile ? 'dvb mobile' : 'dvb'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.dvbImage.childImageSharp.gatsbyImageData} />

              <h3>DV Bern AG</h3>
            </div>

            <div className="details">
              <h2>DV Bern AG</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderMobi() {
    if (!this.props || this.props.filter !== 'mobi') {
      return (
        <Link to="/portfolio/mobi" aria-label="Die Mobiliar - La Mobilière">
          <article className={this.state.mobile ? 'mobi mobile' : 'mobi'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.mobiImage.childImageSharp.gatsbyImageData} />
            </div>

            <div className="details">
              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderIneexa() {
    if (!this.props || this.props.filter !== 'ineexa') {
      return (
        <Link to="/portfolio/ineexa" aria-label="Ineexa">
          <article className={this.state.mobile ? 'ineexa mobile' : 'ineexa'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.ineexaImage.childImageSharp.gatsbyImageData} />

              <h3>Ineexa</h3>
            </div>

            <div className="details">
              <h2>Ineexa</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderOwlly() {
    if (!this.props || this.props.filter !== 'owlly') {
      return (
        <Link to="/portfolio/owlly" aria-label="Owlly">
          <article className={this.state.mobile ? 'owlly mobile' : 'owlly'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.owllyImage.childImageSharp.gatsbyImageData} />

              <h3>Owlly</h3>
            </div>

            <div className="details">
              <h2>Owlly</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderDeckDeckGo() {
    if (!this.props || this.props.filter !== 'deckdeckgo') {
      return (
        <Link to="/portfolio/deckdeckgo" aria-label="DeckDeckGo">
          <article className={this.state.mobile ? 'deckdeckgo mobile' : 'deckdeckgo'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.deckDeckGoImage.childImageSharp.gatsbyImageData} />

              <h3>DeckDeckGo</h3>
            </div>

            <div className="details">
              <h2>DeckDeckGo</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderTieTracker() {
    if (!this.props || this.props.filter !== 'tietracker') {
      return (
        <Link to="/portfolio/tietracker" aria-label="Tie Tracker">
          <article className={this.state.mobile ? 'tietracker mobile' : 'tietracker'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.tieTrackerImage.childImageSharp.gatsbyImageData} />

              <h3>Tie Tracker</h3>
            </div>

            <div className="details">
              <h2>Tie Tracker</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderRebelScan() {
    if (!this.props || this.props.filter !== 'rebelscan') {
      return (
        <Link to="/portfolio/rebelscan" aria-label="Rebel Scan">
          <article className={this.state.mobile ? 'rebelscan mobile' : 'rebelscan'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.rebelscanImage.childImageSharp.gatsbyImageData} />

              <h3>Rebel Scan</h3>
            </div>

            <div className="details">
              <h2>Rebel Scan</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderDiscoverWeeklyDev() {
    if (!this.props || this.props.filter !== 'discoverweeklydev') {
      return (
        <Link to="/portfolio/discoverweeklydev" aria-label="DiscoverWeekly.dev">
          <article className={this.state.mobile ? 'discoverweeklydev mobile' : 'discoverweeklydev'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.discoverweeklydevImage.childImageSharp.gatsbyImageData} />

              <h3>DiscoverWeekly.dev</h3>
            </div>

            <div className="details">
              <h2>DiscoverWeekly.dev</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderWooof() {
    if (!this.props || this.props.filter !== 'wooof') {
      return (
        <Link to="/portfolio/wooof" aria-label="Wooof">
          <article className={this.state.mobile ? 'wooof mobile' : 'wooof'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.wooofImage.childImageSharp.gatsbyImageData} />

              <h3>Wooof</h3>
            </div>

            <div className="details">
              <h2>Wooof</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderWatamato() {
    if (!this.props || this.props.filter !== 'watamato') {
      return (
        <Link to="/portfolio/watamato" aria-label="Watamato">
          <article className={this.state.mobile ? 'watamato mobile' : 'watamato'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.watamatoImage.childImageSharp.gatsbyImageData} />

              <h3>Watamato</h3>
            </div>

            <div className="details">
              <h2>Watamato</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }

  renderFluster() {
    if (!this.props || this.props.filter !== 'fluster') {
      return (
        <Link to="/portfolio/fluster" aria-label="Fluster">
          <article className={this.state.mobile ? 'fluster mobile' : 'fluster'}>
            <div className="summary">
              <GatsbyImage alt="" role="presentation" image={this.props.data.flusterImage.childImageSharp.gatsbyImageData} />

              <h3>Fluster</h3>
            </div>

            <div className="details">
              <h2>Fluster</h2>

              <p>Details</p>
            </div>
          </article>
        </Link>
      );
    } else {
      return undefined;
    }
  }
}

export default ({filter, all}) => (
  <StaticQuery
    query={graphql`
      {
        ourEnergyImage: file(relativePath: {eq: "portfolio/ourenergy-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        ethLibraryLabImage: file(relativePath: {eq: "portfolio/eth-library-lab-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        bonjourCircleImage: file(relativePath: {eq: "portfolio/bonjour-circle-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        bonjourBloomImage: file(relativePath: {eq: "portfolio/bonjour-bloom-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        dvbImage: file(relativePath: {eq: "portfolio/dvb-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        mobiImage: file(relativePath: {eq: "portfolio/mobi-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        deckDeckGoImage: file(relativePath: {eq: "portfolio/deckdeckgo-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        wooofImage: file(relativePath: {eq: "portfolio/wooof-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        rebelscanImage: file(relativePath: {eq: "portfolio/rebelscan-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        discoverweeklydevImage: file(relativePath: {eq: "portfolio/discoverweeklydev-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        watamatoImage: file(relativePath: {eq: "portfolio/watamato-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        tieTrackerImage: file(relativePath: {eq: "portfolio/tietracker-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        flusterImage: file(relativePath: {eq: "portfolio/fluster-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        ineexaImage: file(relativePath: {eq: "portfolio/ineexa-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        owllyImage: file(relativePath: {eq: "portfolio/owlly-dark-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    `}
    render={(data) => <Projects data={data} filter={filter} all={all} />}
  />
);

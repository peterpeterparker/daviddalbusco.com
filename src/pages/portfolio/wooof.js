import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Slider from "../../components/slider/slider"
import PortFolio from "../../components/portfolio/portfolio"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class WooofPage extends React.Component {

  render() {
    const images = [
      this.props.data.wooofScreenshot1.childImageSharp.fluid,
      this.props.data.wooofScreenshot2.childImageSharp.fluid,
      this.props.data.wooofScreenshot3.childImageSharp.fluid,
      this.props.data.wooofScreenshot4.childImageSharp.fluid,
    ]

    return <Layout fixNav={true}>
      <SEO title="Wooof"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.wooofImage.childImageSharp.fluid}>
            <h1>Wooof</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>I have developed this prototype in a day to experiment <a href="https://ionicframework.com/docs/react">Ionic + React</a> for the <a href="https://www.meetup.com/fr-FR/Ionic-Zurich/events/265767496/">Ionic Zürich Meetup</a> Thursday 5th December 2019 🐶</p>
              <p>Beside the pure joy of developing an app to browse doggos, it also allowed me to try out the following features with <a href="https://reactjs.org/">React</a>: fetch API data with hooks, navigation, infinite scroll, refresher, picker, toast, including and using a <a href="https://stenciljs.com">Stencil</a> Web Component, <a href="https://capacitor.ionicframework.com">Capacitor</a> plugins share and storage, services worker to cache images and continuous delivery with <a href="https://github.com/peterpeterparker/wooof/actions">GitHub Actions</a>.</p>
            </div>

            <Slider images={images}/>
          </article>
        </main>
      </section>

      <section className="factsheet">
        <main>
          <Chapter icon="info-circle">
            <h2>Fact sheet</h2>
          </Chapter>

          <article>
            <div>
              <p><strong>Available:</strong> <a href="http://wooof.ch">Progressive Web Apps</a></p>
              <p><strong>Technology:</strong> <a href="http://ionicframework.com">Ionic</a>, <a
                href="https://reactjs.org/">React</a> and <a href="https://capacitor.ionicframework.com">Capacitor</a></p>
            </div>

            <div>
              <p><strong>Rest API</strong>: <a href="https://dog.ceo/dog-api/">Dog API</a></p>
              <p><strong>Infrastructure:</strong> <a href="https://firebase.google.com">Google Cloud Firebase</a> and <a href="https://github.com/peterpeterparker/wooof/actions">GitHub Actions</a></p>
            </div>
          </article>
        </main>
      </section>

      <section className="open-source">
        <main>
          <Chapter icon="book-spells">
            <h2>Open source</h2>
          </Chapter>

          <article>
            <p>This project is open source and available on <a href="https://github.com/peterpeterparker/wooof">Github<FontAwesomeIcon
              icon={["fab", "github"]}/></a></p>
          </article>
        </main>
      </section>

      <PortFolio filter={"wooof"}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        wooofImage: file(relativePath: { eq: "portfolio/wooof-icon.png" }) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        wooofScreenshot1: file(relativePath: { eq: "portfolio/wooof/screenshot1.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        wooofScreenshot2: file(relativePath: { eq: "portfolio/wooof/screenshot2.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        wooofScreenshot3: file(relativePath: { eq: "portfolio/wooof/screenshot3.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        wooofScreenshot4: file(relativePath: { eq: "portfolio/wooof/screenshot4.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <WooofPage data={data}/>
    )}
  />
)

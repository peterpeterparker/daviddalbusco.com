import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Slider from "../../components/slider/slider"
import Projects from "../../components/projects/projects"

class OurEnergyPage extends React.Component {

  render() {
    const images = [
      this.props.data.ourEnergyScreenshot1.childImageSharp.fluid,
      this.props.data.ourEnergyScreenshot2.childImageSharp.fluid,
      this.props.data.ourEnergyScreenshot3.childImageSharp.fluid,
    ]

    return <Layout fixNav={true}>
      <SEO title="Our Energy - ETH Zürich"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.ourEnergyImage.childImageSharp.fluid}>
            <h1>Our Energy - ETH Zürich</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>I have developed the application "Our Energy" for a team of researchers at the <a
                href="https://ethz.ch/">ETH Zürich</a>.</p>
              <p>It is a mobile and web application for citizens to learn how they can intelligently use electricity
                produce from a community scale PV system. This is especially for people who have not yet installed solar
                or who are interested in solar.</p>
              <p>This app was notably used as a support for a 2-week energy challenge in June 2019 for the people of
                Einsiedeln in Switzerland.</p>
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
              <p><strong>Available:</strong> <a href="http://ourenergy.ch">Progressive Web Apps</a>, <a
                href="https://itunes.apple.com/app/id1453497591">Apple Store</a> and <a
                href="http://play.google.com/store/apps/details?id=ch.ourenergy.ourenergy">Google Play</a></p>
              <p><strong>Website:</strong> <a href="http://www.ia.arch.ethz.ch/our-energy/"> iA, Chair of Information Architecture, ETH Zürich</a></p>
            </div>
            <div>
              <p><strong>Technology:</strong> <a href="http://ionicframework.com">Ionic</a>, <a
                href="http://angular.io">Angular</a> and <a href="http://cordova.apache.org">Cordova</a></p>
              <p><strong>Infrastructure:</strong> <a href="https://firebase.google.com">Google Cloud Firebase</a></p>
              <p><strong>Database:</strong> <a href="https://firebase.google.com/docs/firestore">Google Firestore</a></p>
            </div>
          </article>
        </main>
      </section>

      <Projects filter={'ourenergy'}/>
    </Layout>
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
        ourEnergyScreenshot1: file(relativePath: { eq: "portfolio/ourenergy/screenshot1.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        ourEnergyScreenshot2: file(relativePath: { eq: "portfolio/ourenergy/screenshot2.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        ourEnergyScreenshot3: file(relativePath: { eq: "portfolio/ourenergy/screenshot3.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <OurEnergyPage data={data}/>
    )}
  />
)

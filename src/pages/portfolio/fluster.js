import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, Link, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Slider from "../../components/slider/slider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class FlusterPage extends React.Component {

  render() {
    const images = [
      this.props.data.flusterScreenshot1.childImageSharp.fluid,
      this.props.data.flusterScreenshot2.childImageSharp.fluid,
      this.props.data.flusterScreenshot3.childImageSharp.fluid,
      this.props.data.flusterScreenshot4.childImageSharp.fluid,
    ]

    return <Layout fixNav={true}>
      <SEO title="Fluster"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.flusterImage.childImageSharp.fluid}>
            <h2>Fluster</h2>
          </Chapter>

          <article className="info">
            <div className="introduction">
              <p>I have developed "Fluster" as a personal project for which I am no longer really active.</p>
              <p>When I moved to Zürich I was struggling to find flat and roommates, that's why I tried to develop my own platform to help others and myself to solve such problems.</p>
              <p>The startup itself did not succeed but it allowed me to become a freelancer and start my own company, therefore I see the all experience and outcome as a personal win.</p>
            </div>

            <Slider images={images}/>
          </article>
        </main>
      </section>

      <section className="factsheet">
        <main>
          <Chapter icon="info-circle">
            <h3>Fact sheet</h3>
          </Chapter>

          <article>
            <p><strong>Available:</strong> <a href="http://ourenergy.ch">Progressive Web App</a>, <a
              href="https://itunes.apple.com/app/id1453497591">Apple Store</a> and <a
              href="http://play.google.com/store/apps/details?id=ch.ourenergy.ourenergy">Google Play</a></p>
            <p><strong>Website:</strong> <a href="https:fluster.io">Fluster.io</a></p>
            <p><strong>Technology (application):</strong> <a href="http://ionicframework.com">Ionic</a>, <a
              href="http://angular.io">Angular</a> and <a href="http://cordova.apache.org">Cordova</a></p>
            <p><strong>Technology (website):</strong>: <a href="http://angular.io">Angular</a>, <a href="https://material.angular.io/">Angular Material</a> and <a href="https://angular.io/guide/universal">Angular Service-side Rendering (SSR)</a></p>
            <p><strong>Technology (backend, API):</strong> <a href="https://nodejs.org/">NodeJS</a> and <a href="https://expressjs.com">ExpressJS</a></p>
            <p><strong>Infrastructure:</strong> <a href="https://aws.amazon.com/ec2/">Amazon EC2</a> and <a href="https://aws.amazon.com/fr/sns/">Amazon SNS</a></p>
            <p><strong>Database:</strong> <a href="https://www.mongodb.com">MongoDB</a></p>
          </article>
        </main>
      </section>

      <section className="open-source">
        <main>
          <Chapter icon="book-spells">
            <h3>Open source</h3>
          </Chapter>

          <article>
            <p>This project is open source and available on <a href="https://github.com/fluster">Github<FontAwesomeIcon icon={["fab", "github"]}/></a></p>
          </article>
        </main>
      </section>

      <section className="back-portfolio">
        <Link to='/#portfolio' className="button"><h2>Portfolio</h2></Link>
      </section>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        flusterImage: file(relativePath: { eq: "portfolio/fluster-icon-pink.png" }) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        flusterScreenshot1: file(relativePath: { eq: "portfolio/fluster/screenshot1.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        flusterScreenshot2: file(relativePath: { eq: "portfolio/fluster/screenshot2.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        flusterScreenshot3: file(relativePath: { eq: "portfolio/fluster/screenshot3.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        flusterScreenshot4: file(relativePath: { eq: "portfolio/fluster/screenshot4.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <FlusterPage data={data}/>
    )}
  />
)

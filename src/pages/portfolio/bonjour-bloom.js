import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Projects from "../../components/projects/projects"
import Slider from "../../components/slider/slider"

class BonjourBloomPage extends React.Component {

  render() {
    const images = [
      this.props.data.bonjourBloomScreenshot1.childImageSharp.fluid,
      this.props.data.bonjourBloomScreenshot2.childImageSharp.fluid,
      this.props.data.bonjourBloomScreenshot3.childImageSharp.fluid,
    ]

    return <Layout fixNav={true}>
      <SEO title="Bonjour - Bloom"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.bonjourBloomImage.childImageSharp.fluid}>
            <h1>Bonjour - Bloom</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>I developed several components and applications for <a href="https://www.customfuture.com" rel="noopener noreferrer">customfuture
                SA</a> and "Bonjour".</p>
              <p>One of these, called "Bloom", is a prototype to provide an interactive
                self-appraisal tool.</p>
              <p>From a technical point a view, what's interesting in this particular project created in a short time
                frame, is the fact that
                several <a href="https://stenciljs.com/" rel="noopener noreferrer">StencilJS</a> Web Components have been developed in order to
                reuse them in the future in any modern applications, regardless of their technologies.</p>
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
              <p><strong>Available:</strong> <a href="https://bonjour-bloom.web.app" rel="noopener noreferrer">Progressive Web Apps</a></p>
              <p><strong>Website:</strong> <a href="https://bonjour.help" rel="noopener noreferrer"> Bonjour.help</a></p>
            </div>
            <div>
              <p><strong>Technology:</strong> <a href="https://stenciljs.com/" rel="noopener noreferrer">StencilJS</a>, <a
                href="http://ionicframework.com" rel="noopener noreferrer">Ionic</a> and <a
                href="http://angular.io" rel="noopener noreferrer">Angular</a></p>
            </div>
          </article>
        </main>
      </section>

      <Projects filter={"bonjour-bloom"}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        bonjourBloomImage: file(relativePath: { eq: "portfolio/bonjour-bloom-icon.png" }) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        bonjourBloomScreenshot1: file(relativePath: { eq: "portfolio/bonjour/bloom/screenshot1.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        bonjourBloomScreenshot2: file(relativePath: { eq: "portfolio/bonjour/bloom/screenshot2.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        },
        bonjourBloomScreenshot3: file(relativePath: { eq: "portfolio/bonjour/bloom/screenshot3.png" }) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <BonjourBloomPage data={data}/>
    )}
  />
)

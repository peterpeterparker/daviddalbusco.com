import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"
import Chapter from "../../components/chapter/chapter"

class OurEnergyPage extends React.Component {

  render() {
    return <Layout fixNav={true}>
      <SEO title="Our Energy - ETH Zürich"/>

      <section className="project extraspace">
        <main>
          <Chapter img={this.props.data.ourEnergyImage.childImageSharp.fluid}>
            <h2> Our Energy - ETH Zürich</h2>
          </Chapter>

          <article>
            <div className="introduction">
              <p>I have developed the application "Our Energy" for a team of researchers at the <a href="https://ethz.ch/">ETH Zürich</a>.</p>
              <p>It is a mobile and web application for citizens to learn how they can intelligently use electricity produce from a community scale PV system. This is especially for people who have not yet installed solar or who are interested in solar.</p>
              <p>This app was notably used as a support for a 2-week energy challenge in June 2019 for the people of Einsiedeln in Switzerland.</p>
            </div>

            <div className="screenshots">
            </div>
          </article>
        </main>
      </section>
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
        }
      }
    `}
    render={(data) => (
      <OurEnergyPage data={data}/>
    )}
  />
)

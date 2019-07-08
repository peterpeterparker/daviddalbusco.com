import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import PortFolio from "../../components/portfolio/portfolio"

class OurEnergyPage extends React.Component {

  render() {
    return <Layout fixNav={true}>
      <SEO title="Bonjour"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.bonjourImage.childImageSharp.fluid}>
            <h1>Bonjour</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>I am currently developing several components and applications for <a href="https://www.customfuture.com">customfuture SA</a> and "Bonjour".</p>
              <p>Their charity "Think-and-do Tank" projects are incubator for idea, tools and impulse for a bette self-determined life.</p>
              <p>Their goal is to work together for a better future.</p>
            </div>
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
              <p><strong>Technology:</strong> <a href="http://ionicframework.com">Ionic</a>, <a href="https://stenciljs.com">StencilJS</a>, <a
                href="http://angular.io">Angular</a> and <a href="http://cordova.apache.org">Cordova</a></p>
              <p><strong>Website:</strong> <a href="https://bonjour.help"> Bonjour.help</a></p>
            </div>
            <div>
              <p><strong>Infrastructure:</strong> <a href="https://firebase.google.com">Google Cloud Firebase</a></p>
              <p><strong>Database:</strong> <a href="https://firebase.google.com/docs/firestore">Google Firestore</a></p>
            </div>
          </article>
        </main>
      </section>

      <PortFolio filter={'bonjour'}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        bonjourImage: file(relativePath: { eq: "portfolio/bonjour-icon.png" }) {
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

import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Projects from "../../components/projects/projects"

class IneexaPage extends React.Component {

  render() {
    return <Layout fixNav={true}>
      <SEO title="Ineexa"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.ineexaImg.childImageSharp.fluid}>
            <h1>Ineexa</h1>
          </Chapter>

          <article className="info">
            <div>
              <p><a href="https://ineexa.ch" rel="noopener noreferrer">Ineexa</a> is a digital solution for the construction industry. It automates the costing of materials and the creation of offers.</p>
              <p>For this project, I took care of the frontend development of the prototype which had for goal the creation of a simple wizard (login > upload > edit > done) inspired by web-shops' checkout process.</p>
              <p>In addition to the development, I designed the UI of the application too.</p>
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
              <p><strong>Technology:</strong> <a href="http://ionicframework.com" rel="noopener noreferrer">Ionic</a> and <a
                href="https://reactjs.org/" rel="noopener noreferrer">React</a></p>
            </div>
            <div>
              <p><strong>Website:</strong> <a href="https://ineexa.ch" rel="noopener noreferrer"> Ineexa.ch</a></p>
            </div>
          </article>
        </main>
      </section>

      <Projects filter={"ineexa"}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        ineexaImg: file(relativePath: { eq: "portfolio/ineexa-icon.png" }) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <IneexaPage data={data}/>
    )}
  />
)

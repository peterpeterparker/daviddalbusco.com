import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Projects from "../../components/projects/projects"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class OwllyPage extends React.Component {
  render() {
    return (
      <Layout fixNav={true}>
        <SEO title="Owlly" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.owllyLightImg.childImageSharp.fluid}>
              <h1>Owlly</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I had the opportunity to participate to{" "}
                  <a href="https://owlly.ch" rel="noopener noreferrer">
                    Owlly
                  </a>
                  , an amazing and meaningful open source project, which enables
                  the secure and easy electronic signing, validation and
                  counting of popular initiatives and referendums for campaign
                  platforms and offers a holistic e-collecting approach for
                  Switzerland🇨🇭.
                </p>
                <p>
                  As part of this project, I notably developed a Web Component
                  which can be integrated in any websites or applications to
                  ease the access to the Owlly's wizard.
                </p>
                <p>
                  In addition, I supported the team in their technical decisions
                  and also developed some part of the website, wizard and cloud
                  functions.
                </p>
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
                <p>
                  <strong>Technology:</strong>{" "}
                  <a href="http://stenciljs.com" rel="noopener noreferrer">
                    StencilJS
                  </a>
                  ,{" "}
                  <a href="http://angular.io" rel="noopener noreferrer">
                    Angular
                  </a>{" "}
                  and{" "}
                  <a href="http://tailwindcss.com/" rel="noopener noreferrer">
                    Tailwind CSS
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href="https://owlly.ch" rel="noopener noreferrer">
                    {" "}
                    Owlly.ch
                  </a>
                </p>
                <p>
                  <strong>Documentation:</strong>{" "}
                  <a href="https://docs.owlly.ch" rel="noopener noreferrer">
                    {" "}
                    docs.owlly.ch
                  </a>{" "}
                  made with{" "}
                  <a href="https://storybook.js.org/" rel="noopener noreferrer">
                    {" "}
                    Storybook
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <strong>Infrastructure:</strong>{" "}
                  <a
                    href="https://firebase.google.com"
                    rel="noopener noreferrer"
                  >
                    Google Cloud Firebase
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://cloud.google.com/functions"
                    rel="noopener noreferrer"
                  >
                    Functions
                  </a>
                </p>
                <p>
                  <strong>Database:</strong>{" "}
                  <a
                    href="https://firebase.google.com/docs/firestore"
                    rel="noopener noreferrer"
                  >
                    Google Firestore
                  </a>
                </p>
              </div>
            </article>
          </main>
        </section>

        <section className="open-source">
          <main>
            <Chapter icon="code-branch">
              <h2>Open source</h2>
            </Chapter>

            <article>
              <p>
                This project is open source and available on{" "}
                <a
                  href="https://github.com/project-owlly/"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <FontAwesomeIcon icon={["fab", "github"]} />
                </a>
              </p>
            </article>
          </main>
        </section>

        <Projects filter={"owlly"} />
      </Layout>
    )
  }
}

const OwllyPageQuery = () => (
  <StaticQuery
    query={graphql`
      query {
        owllyLightImg: file(
          relativePath: { eq: "portfolio/owlly-light-icon.png" }
        ) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => <OwllyPage data={data} />}
  />
)

export default OwllyPageQuery

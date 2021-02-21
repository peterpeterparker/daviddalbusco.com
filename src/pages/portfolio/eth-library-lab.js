import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Projects from "../../components/projects/projects"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class EthLibraryLabPage extends React.Component {
  render() {
    return (
      <Layout fixNav={true}>
        <SEO title="ETH Library Lab" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.ethLibraryLab.childImageSharp.fluid}>
              <h1>ETH Library Lab</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I am providing consulting services to the{" "}
                  <a
                    href="http://www.librarylab.ethz.ch"
                    rel="noopener noreferrer"
                  >
                    ETH Library Lab
                  </a>
                  , an initiative for human-centered innovation in the knowledge
                  sphere from{" "}
                  <a href="https://ethz.ch/" rel="noopener noreferrer">
                    ETH Zürich
                  </a>
                  .
                </p>
                <p>
                  The lab has for mission to help students, researchers and
                  educators to unleash their full potential by boosting ideas
                  that support them in discovering, accessing, using or sharing
                  scientific information and knowledge.
                </p>
                <p>
                  As part of their projects, I use my engineering background and
                  experience to provide:
                </p>
                <ul>
                  <li>advices on project management, planning and services</li>
                  <li>discuss technical questions</li>
                  <li>recommandations on design and UX topics</li>
                  <li>
                    support regarding the open source and prototyping concepts
                  </li>
                </ul>
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
                The Lab seeks to advance tools, systems, practices and services
                and therefore will publish, at least, some projects and
                prototypes as open source softwares on{" "}
                <a
                  href="https://github.com/eth-library-lab"
                  rel="noopener noreferrer"
                >
                  GitHub
                  <FontAwesomeIcon icon={["fab", "github"]} />
                </a>
              </p>
            </article>
          </main>
        </section>

        <Projects filter={"eth-library-lab"} />
      </Layout>
    )
  }
}

const EthLibraryLabPageQuery = () => (
  <StaticQuery
    query={graphql`
      query {
        ethLibraryLab: file(
          relativePath: { eq: "portfolio/eth-library-lab-icon.png" }
        ) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => <EthLibraryLabPage data={data} />}
  />
)

export default EthLibraryLabPageQuery

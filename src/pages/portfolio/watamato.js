import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Projects from "../../components/projects/projects"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { debounce } from "@deckdeckgo/utils"

class WatamatoPage extends React.Component {

  async componentDidMount() {
    await this.initVideoSize()

    window.addEventListener("resize", debounce(async () => {
      await this.resizeVideoSize()
    }))
  }

  async initVideoSize() {
    const element = document.querySelector("deckgo-youtube")

    if (element) {
      let width = element.parentElement.parentElement.offsetWidth > 560 ? element.parentElement.parentElement.offsetWidth / 2 : element.parentElement.parentElement.offsetWidth
      width = width - 64;

      element.width = `${width}`
      element.height = `${(width * 3) / 4}`
    }
  }

  async resizeVideoSize() {
    const element = document.querySelector("deckgo-youtube")

    if (element) {
      let width = element.parentElement.parentElement.offsetWidth > 560 ? element.parentElement.parentElement.offsetWidth / 2 : element.parentElement.parentElement.offsetWidth
      width = width - 64;
      await element.updateIFrame(width, (width * 3) / 4)
    }
  }

  render() {

    return <Layout fixNav={true}>
      <SEO title="Watamato"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.watamatoImage.childImageSharp.fluid}>
            <h1>Watamato</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>Once again I had to find a flat in Zürich and therefore once again I had to use search engines I don't like much in terms of UX.</p>
              <p>That's why I have built myself, in just a couple of days, a <a href="https://trello.com" rel="noopener noreferrer">Trello</a> like board for my flat hunting.</p>
              <p>Moreover, from a technical point of view, it was an interesting use case to try out <a href="https://github.com/puppeteer/puppeteer" rel="noopener noreferrer">Puppeteer</a> and the development of the board itself was also surprisingly a bit challenging, as maintaining a dynamic sorted order and using a single infinite scroller for multiple columns at the same time wasn't that straight forward.</p>
            </div>

            <div className="video">
              <deckgo-youtube src="https://www.youtube.com/watch?v=nuITBKXGfA4" instant={true}></deckgo-youtube>
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
              <p><strong>Available:</strong> <a href="http://watamato.com" rel="noopener noreferrer">Progressive Web Apps</a></p>
              <p><strong>Technology:</strong> <a href="http://ionicframework.com" rel="noopener noreferrer">Ionic</a> and <a
                href="https://angular.io/" rel="noopener noreferrer">Angular</a> </p>
            </div>

            <div>
              <p><strong>Infrastructure:</strong> <a href="https://firebase.google.com" rel="noopener noreferrer">Google Cloud Firebase</a> and <a href="https://github.com/peterpeterparker/watamato/tree/master/.github/workflows" rel="noopener noreferrer">GitHub Actions</a></p>
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
            <p>This project is open source and available on <a href="https://github.com/peterpeterparker/watamato" rel="noopener noreferrer">GitHub<FontAwesomeIcon
              icon={["fab", "github"]}/></a></p>
          </article>
        </main>
      </section>

      <Projects filter={"watamato"}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        watamatoImage: file(relativePath: { eq: "portfolio/watamato-icon.png" }) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <WatamatoPage data={data}/>
    )}
  />
)

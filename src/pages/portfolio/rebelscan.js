import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import Projects from "../../components/projects/projects"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { debounce } from "@deckdeckgo/utils"

class RebelScanPage extends React.Component {

  async componentDidMount() {
    this.initFrameSize()

    window.addEventListener("resize", debounce(() => {
      this.initFrameSize()
    }))
  }

  initFrameSize() {
    const frameElement = document.querySelector("iframe")

    if (frameElement) {
      const width = frameElement.parentElement.offsetWidth > 560 ? frameElement.parentElement.offsetWidth / 2 : frameElement.parentElement.offsetWidth
      frameElement.width = `${width}`
      frameElement.height = `${(width * 3) / 4}`
    }
  }

  render() {
    return <Layout fixNav={true}>
      <SEO title="Rebel Scan"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.rebelscanImage.childImageSharp.fluid}>
            <h1>Rebel Scan</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>This last Christmas holidays, except visiting my parents for a couple of days, after having forced myself in a sort of auto-lockdown period first, I did not have any big plans. That's why, I took the opportunity to improve my software development knowledge.</p>
              <p>Therefore, I defined the following objectives I never had tried before and, which I was eager to test:</p>

              <ol>
                <li>Give a try to <a href="https://nextjs.org/" rel="noopener noreferrer">Next.js</a></li>
                <li>Capture and crop a video stream using the <a href="https://developer.mozilla.org/fr/docs/Web/API/MediaDevices/getUserMedia" rel="noopener noreferrer">MediaDevices.getUserMedia()</a> API</li>
              <li>Generate <a href="https://reactjs.org/" rel="noopener noreferrer">React</a> bindings for a Web Component developed with <a href="https://stenciljs.com/" rel="noopener noreferrer">StencilJS</a></li>
                <li>Share files using strictly only the <a href="https://developer.mozilla.org/fr/docs/Web/API/Navigator/share" rel="noopener noreferrer">Web Share</a> API</li>
              </ol>

              <p>I called the prototype <a href="https://rebelscan.com/" rel="noopener noreferrer">Rebel Scan</a> because, it is just a little scanner app, you rebel scum!</p>
            </div>

            <iframe title="Rebel Scan demo" src="https://www.youtube.com/embed/D3gfjqAo_Qs" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
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
              <p><strong>Available:</strong> <a href="http://rebelscan.com" rel="noopener noreferrer">Progressive Web Apps</a></p>
              <p><strong>Technology:</strong> <a href="https://nextjs.org/" rel="noopener noreferrer">Next.js</a>, <a
                href="https://reactjs.org/">React</a>, <a href="https://stenciljs.com/" rel="noopener noreferrer">StencilJS</a> and Web APIs</p>
            </div>

            <div>
              <p><strong>Infrastructure:</strong> <a href="https://vercel.com" rel="noopener noreferrer">Vercel</a></p>
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
            <p>This project is open source and available on <a href="https://github.com/peterpeterparker/rebelscan" rel="noopener noreferrer">GitHub<FontAwesomeIcon
              icon={["fab", "github"]}/></a></p>
          </article>
        </main>
      </section>

      <Projects filter={"rebelscan"}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        rebelscanImage: file(relativePath: { eq: "portfolio/rebelscan-icon.png" }) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => (
      <RebelScanPage data={data}/>
    )}
  />
)

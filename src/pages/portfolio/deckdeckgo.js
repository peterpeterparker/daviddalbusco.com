import React from "react"
import SEO from "../../components/seo/seo"
import Layout from "../../components/layout/layout"
import { graphql, StaticQuery } from "gatsby"

import Chapter from "../../components/chapter/chapter"
import PortFolio from "../../components/portfolio/portfolio"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class OurEnergyPage extends React.Component {

  async componentDidMount() {
    // TODO: Workaround. To be removed when https://github.com/ionic-team/stencil/issues/1724 will be solved
    try {
      const deckdeckgoCoreLoader = require("@deckdeckgo/core/dist/loader")

      await deckdeckgoCoreLoader.defineCustomElements(window)
    } catch (err) {
      console.error(err);
    }

    const youtube = document.querySelector('deckgo-youtube');

    if (youtube) {
      youtube.width = youtube.parentElement.offsetWidth > 768 ? youtube.parentElement.offsetWidth / 2 : youtube.parentElement.offsetWidth;
      youtube.height= youtube.parentElement.offsetHeight;

      await youtube.lazyLoadContent();
    }
  }

  render() {
    return <Layout fixNav={true}>
      <SEO title="DeckDeckGo"/>

      <section className="project extrabigspace">
        <main>
          <Chapter img={this.props.data.deckdeckgoImage.childImageSharp.fluid}>
            <h1>DeckDeckGo</h1>
          </Chapter>

          <article className="info">
            <div>
              <p>I started this project, "DeckDeckGo", in october 2018. I had to prepare a talk about <a href="https://ionicframework.com">Ionic</a> v4 and Web Components and I noticed that I wasn't using the technology I was about to display.</p>
              <p>As any engineer, what did I do in such situation? I created quickly a library using <a href="https://stenciljs.com">StencilJS</a> to write my presentation only with Web Components.</p>
              <p>After the presentation I did continue to "work" on my spare time on the project as it is for me a way to learn new technologies and concept.</p>
              <p>Meanwhile <a href="https://nmattia.com">Nicolas Mattia</a> joined the project and together we decided to have even more fun by turning it into a fully web open source editor for presentations.</p>
            </div>

            <deckgo-youtube src="https://www.youtube.com/watch?v=3o3oGBTTRSs" frameTitle={'DeckDeckGo'}>
            </deckgo-youtube>
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
              <p><strong>Available:</strong> Progressive Web Apps</p>
              <p><strong>Technology:</strong> <a href="https://stenciljs.com">StencilJS</a>, <a href="http://ionicframework.com">Ionic</a>, <a href="https://webrtc.org">WebRTC</a>, <a href="https://d3js.org">D3js</a>, etc.</p>
              <p><strong>Website:</strong> <a href="https://deckdeckgo.com"> DeckDeckGo.com</a></p>
            </div>
            <div>
              <p><strong>Documentation:</strong> <a href="https://docs.deckdeckgo.com"> Docs.DeckDeckGo.com</a></p>
              <p><strong>Infrastructure:</strong> <a href="https://firebase.google.com">Google Cloud Firebase</a></p>
              <p><strong>Database:</strong> <a href="https://firebase.google.com/docs/firestore">Google Firestore</a></p>
            </div>
          </article>

          <p>The complexity of the project goes way beyond what is summarized above as each presentations written with DeckDeckGo are packaged and published online as self autonomous Progressive Web Apps. For such process we notably use <a href="https://aws.amazon.com/">Amazon AWS</a>, <a href="https://www.haskell.org/">Haskell</a>, <a href="https://nixos.org/nix/">Nix</a> and <a href="https://www.terraform.io/">Terraform</a>. All the credits for the implementation of this amazing tool chain goes to <a href="https://nmattia.com">Nicolas Mattia</a>.</p>
        </main>
      </section>

      <section className="open-source">
        <main>
          <Chapter icon="book-spells">
            <h2>Open source</h2>
          </Chapter>

          <article>
            <p>This project is open source and available on <a href="https://github.com/deckgo/deckdeckgo">Github<FontAwesomeIcon
              icon={["fab", "github"]}/></a></p>
          </article>
        </main>
      </section>

      <PortFolio filter={'deckdeckgo'}/>
    </Layout>
  }

}

export default () => (
  <StaticQuery
    query={graphql`
      query {
        deckdeckgoImage: file(relativePath: { eq: "portfolio/deckdeckgo-icon.png" }) {
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

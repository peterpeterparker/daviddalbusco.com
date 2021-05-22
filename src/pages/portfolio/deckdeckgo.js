import React from 'react';
import Seo from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Projects from '../../components/projects/projects';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {debounce} from '@deckdeckgo/utils';

class DeckDeckGoPage extends React.Component {
  async componentDidMount() {
    this.initFrameSize();

    window.addEventListener(
      'resize',
      debounce(() => {
        this.initFrameSize();
      })
    );
  }

  initFrameSize() {
    const frameElement = document.querySelector('iframe');

    if (frameElement) {
      const width =
        frameElement.parentElement.offsetWidth > 560 ? frameElement.parentElement.offsetWidth / 2 : frameElement.parentElement.offsetWidth;
      frameElement.width = `${width}`;
      frameElement.height = `${(width * 3) / 4}`;
    }
  }

  render() {
    return (
      <Layout fixNav={true}>
        <Seo title="DeckDeckGo" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.deckdeckgoImage.childImageSharp.gatsbyImageData}>
              <h1>DeckDeckGo</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I started this project, "DeckDeckGo", in october 2018. I had to prepare a talk about{' '}
                  <a href="https://ionicframework.com" rel="noopener noreferrer">
                    Ionic
                  </a>{' '}
                  v4 and Web Components and I noticed that I wasn't using the technology I was about to display.
                </p>
                <p>
                  As any engineer, what did I do in such situation? I created quickly a library using{' '}
                  <a href="https://stenciljs.com" rel="noopener noreferrer">
                    StencilJS
                  </a>{' '}
                  to write my presentation only with Web Components.
                </p>
                <p>
                  After the presentation I did continue to "work" on my spare time on the project as it is for me a way to learn new
                  technologies and concept.
                </p>
                <p>
                  Meanwhile{' '}
                  <a href="https://nmattia.com" rel="noopener noreferrer">
                    Nicolas Mattia
                  </a>{' '}
                  joined the project and together we decided to have even more fun by turning it into a fully web open source editor for
                  presentations.
                </p>
              </div>

              <iframe
                title="Introducing DeckDeckGo"
                frameBorder={0}
                src="https://beta.deckdeckgo.io/daviddalbusco/introducing-deckdeckgo/"></iframe>
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
                  <strong>Available:</strong> Progressive Web Apps
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href="https://deckdeckgo.com" rel="noopener noreferrer">
                    {' '}
                    DeckDeckGo.com
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <strong>Technology:</strong>{' '}
                  <a href="https://stenciljs.com" rel="noopener noreferrer">
                    StencilJS
                  </a>
                  ,{' '}
                  <a href="http://ionicframework.com" rel="noopener noreferrer">
                    Ionic
                  </a>
                  ,{' '}
                  <a href="https://webrtc.org" rel="noopener noreferrer">
                    WebRTC
                  </a>
                  ,{' '}
                  <a href="https://d3js.org" rel="noopener noreferrer">
                    D3js
                  </a>
                  , etc.
                </p>
                <p>
                  <strong>Infrastructure:</strong>{' '}
                  <a href="https://firebase.google.com" rel="noopener noreferrer">
                    Google Cloud Firebase
                  </a>
                </p>
                <p>
                  <strong>Database:</strong>{' '}
                  <a href="https://firebase.google.com/docs/firestore" rel="noopener noreferrer">
                    Google Firestore
                  </a>
                </p>
              </div>
            </article>

            <p>
              The complexity of the project goes way beyond what is summarized above as each presentations written with DeckDeckGo are
              packaged and published online as self autonomous Progressive Web Apps. For such process we notably use{' '}
              <a href="https://aws.amazon.com/">Amazon AWS</a>, <a href="https://www.haskell.org/">Haskell</a>,{' '}
              <a href="https://nixos.org/nix/">Nix</a> and <a href="https://www.terraform.io/">Terraform</a>. All the credits for the
              implementation of this amazing tool chain goes to <a href="https://nmattia.com">Nicolas Mattia</a>.
            </p>
          </main>
        </section>

        <section className="open-source">
          <main>
            <Chapter icon="code-branch">
              <h2>Open source</h2>
            </Chapter>

            <article>
              <p>
                This project is open source and available on{' '}
                <a href="https://github.com/deckgo/deckdeckgo">
                  GitHub
                  <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
              </p>
            </article>
          </main>
        </section>

        <Projects filter={'deckdeckgo'} />
      </Layout>
    );
  }
}

const DeckDeckgoPageQuery = () => (
  <StaticQuery
    query={graphql`
      {
        deckdeckgoImage: file(relativePath: {eq: "portfolio/deckdeckgo-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    `}
    render={(data) => <DeckDeckGoPage data={data} />}
  />
);

export default DeckDeckgoPageQuery;

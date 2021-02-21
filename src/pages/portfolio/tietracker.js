import React from 'react';
import SEO from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Slider from '../../components/slider/slider';
import Projects from '../../components/projects/projects';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class TieTrackerPage extends React.Component {
  render() {
    const images = [
      this.props.data.tieTrackerScreenshot1.childImageSharp.fluid,
      this.props.data.tieTrackerScreenshot2.childImageSharp.fluid,
      this.props.data.tieTrackerScreenshot3.childImageSharp.fluid,
    ];

    return (
      <Layout fixNav={true}>
        <SEO title="Tie Tracker" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.tieTrackerImage.childImageSharp.fluid}>
              <h1>Tie Tracker</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I was looking to improve my knowledge regarding{' '}
                  <a href="https://reactjs.org" rel="noopener noreferrer">
                    React
                  </a>{' '}
                  and{' '}
                  <a href="https://react-redux.js.org" rel="noopener noreferrer">
                    Redux
                  </a>
                  , that's why I started the development of this simple, open source and free time tracking app ⏱️
                </p>
                <p>This is also the application I aim to use to track my working hours and plan to use, to export my timesheet reports.</p>
                <p>
                  Furthermore, it was also interesting to develop a fully offline solution with{' '}
                  <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" rel="noopener noreferrer">
                    IndexedDB
                  </a>
                  , experiment{' '}
                  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers" rel="noopener noreferrer">
                    Web Workers
                  </a>{' '}
                  (in order to defer "heavy" computation) and try out the new{' '}
                  <a href="https://web.dev/native-file-system/" rel="noopener noreferrer">
                    Native File System API
                  </a>
                  .
                </p>
              </div>

              <Slider images={images} />
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
                  <strong>Available:</strong>{' '}
                  <a href="https://tietracker.com" rel="noopener noreferrer">
                    Progressive Web Apps
                  </a>
                  ,{' '}
                  <a href="https://itunes.apple.com/app/id1493399075" rel="noopener noreferrer">
                    Apple Store
                  </a>{' '}
                  and{' '}
                  <a href="http://play.google.com/store/apps/details?id=com.tietracker.app" rel="noopener noreferrer">
                    Google Play
                  </a>
                </p>
                <p>
                  <strong>Technology:</strong>{' '}
                  <a href="http://ionicframework.com" rel="noopener noreferrer">
                    Ionic
                  </a>
                  ,{' '}
                  <a href="https://reactjs.org/" rel="noopener noreferrer">
                    React
                  </a>{' '}
                  and{' '}
                  <a href="https://capacitor.ionicframework.com" rel="noopener noreferrer">
                    Capacitor
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <strong>Infrastructure:</strong>{' '}
                  <a href="https://firebase.google.com" rel="noopener noreferrer">
                    Google Cloud Hosting
                  </a>{' '}
                  and{' '}
                  <a href="https://github.com/peterpeterparker/tietracker/tree/master/.github/workflows" rel="noopener noreferrer">
                    GitHub Actions
                  </a>
                </p>
                <p>
                  <strong>Database:</strong> Offline with{' '}
                  <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API" rel="noopener noreferrer">
                    IndexedDB
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
                This project is open source and available on{' '}
                <a href="https://github.com/peterpeterparker/tietracker" rel="noopener noreferrer">
                  GitHub
                  <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
              </p>
            </article>
          </main>
        </section>

        <Projects filter={'tietracker'} />
      </Layout>
    );
  }
}

const TieTrackerPageQuery = () => (
  <StaticQuery
    query={graphql`
      query {
        tieTrackerImage: file(relativePath: {eq: "portfolio/tietracker-icon.png"}) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        tieTrackerScreenshot1: file(relativePath: {eq: "portfolio/tietracker/screenshot1.png"}) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        tieTrackerScreenshot2: file(relativePath: {eq: "portfolio/tietracker/screenshot2.png"}) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        tieTrackerScreenshot3: file(relativePath: {eq: "portfolio/tietracker/screenshot3.png"}) {
          childImageSharp {
            fluid(maxWidth: 540) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => <TieTrackerPage data={data} />}
  />
);

export default TieTrackerPageQuery;

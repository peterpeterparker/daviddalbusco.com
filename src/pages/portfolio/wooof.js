import React from 'react';
import Seo from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Slider from '../../components/slider/slider';
import Projects from '../../components/projects/projects';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class WooofPage extends React.Component {
  render() {
    const images = [
      this.props.data.wooofScreenshot1.childImageSharp.gatsbyImageData,
      this.props.data.wooofScreenshot2.childImageSharp.gatsbyImageData,
      this.props.data.wooofScreenshot3.childImageSharp.gatsbyImageData,
      this.props.data.wooofScreenshot4.childImageSharp.gatsbyImageData,
    ];

    return (
      <Layout fixNav={true}>
        <Seo title="Wooof" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.wooofImage.childImageSharp.gatsbyImageData}>
              <h1>Wooof</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I have developed this prototype in a day to experiment{' '}
                  <a href="https://ionicframework.com/docs/react" rel="noopener noreferrer">
                    Ionic + React
                  </a>{' '}
                  for the{' '}
                  <a href="https://www.meetup.com/fr-FR/Ionic-Zurich/events/265767496/" rel="noopener noreferrer">
                    Ionic Zürich Meetup
                  </a>{' '}
                  Thursday 5th December 2019 🐶
                </p>
                <p>
                  Beside the pure joy of developing an app to browse doggos, it also allowed me to try out the following features with{' '}
                  <a href="https://reactjs.org/" rel="noopener noreferrer">
                    React
                  </a>
                  : fetch API data with hooks, navigation, infinite scroll, refresher, picker, toast, including and using a{' '}
                  <a href="https://stenciljs.com" rel="noopener noreferrer">
                    Stencil
                  </a>{' '}
                  Web Component,{' '}
                  <a href="https://capacitor.ionicframework.com" rel="noopener noreferrer">
                    Capacitor
                  </a>{' '}
                  plugins share and storage, services worker to cache images and continuous delivery with{' '}
                  <a href="https://github.com/peterpeterparker/wooof/actions" rel="noopener noreferrer">
                    GitHub Actions
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
                  <a href="http://wooof.ch" rel="noopener noreferrer">
                    Progressive Web Apps
                  </a>
                </p>
                <p>
                  <strong>Technology:</strong>{' '}
                  <a href="http://ionicframework.com" rel="noopener noreferrer">
                    Ionic
                  </a>
                  , <a href="https://reactjs.org/">React</a> and{' '}
                  <a href="https://capacitor.ionicframework.com" rel="noopener noreferrer">
                    Capacitor
                  </a>
                </p>
              </div>

              <div>
                <p>
                  <strong>Rest API</strong>:{' '}
                  <a href="https://dog.ceo/dog-api/" rel="noopener noreferrer">
                    Dog API
                  </a>
                </p>
                <p>
                  <strong>Infrastructure:</strong>{' '}
                  <a href="https://firebase.google.com" rel="noopener noreferrer">
                    Google Cloud Firebase
                  </a>{' '}
                  and{' '}
                  <a href="https://github.com/peterpeterparker/wooof/tree/master/.github/workflows" rel="noopener noreferrer">
                    GitHub Actions
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
                <a href="https://github.com/peterpeterparker/wooof" rel="noopener noreferrer">
                  GitHub
                  <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
              </p>
            </article>
          </main>
        </section>

        <Projects filter={'wooof'} />
      </Layout>
    );
  }
}

const WooofPageQuery = () => (
  <StaticQuery
    query={graphql`
      {
        wooofImage: file(relativePath: {eq: "portfolio/wooof-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        wooofScreenshot1: file(relativePath: {eq: "portfolio/wooof/screenshot1.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        wooofScreenshot2: file(relativePath: {eq: "portfolio/wooof/screenshot2.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        wooofScreenshot3: file(relativePath: {eq: "portfolio/wooof/screenshot3.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        wooofScreenshot4: file(relativePath: {eq: "portfolio/wooof/screenshot4.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    `}
    render={(data) => <WooofPage data={data} />}
  />
);

export default WooofPageQuery;

import React from 'react';
import Seo from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Slider from '../../components/slider/slider';
import Projects from '../../components/projects/projects';

class OurEnergyPage extends React.Component {
  render() {
    const images = [
      this.props.data.ourEnergyScreenshot1.childImageSharp.gatsbyImageData,
      this.props.data.ourEnergyScreenshot2.childImageSharp.gatsbyImageData,
      this.props.data.ourEnergyScreenshot3.childImageSharp.gatsbyImageData,
    ];

    return (
      <Layout fixNav={true}>
        <Seo title="Our Energy - ETH Zürich" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.ourEnergyImage.childImageSharp.gatsbyImageData}>
              <h1>Our Energy - ETH Zürich</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I have developed the application "Our Energy" for a team of researchers at the{' '}
                  <a href="https://ethz.ch/" rel="noopener noreferrer">
                    ETH Zürich
                  </a>
                  .
                </p>
                <p>
                  It is a mobile and web application for citizens to learn how they can intelligently use electricity produce from a
                  community scale PV system. This is especially for people who have not yet installed solar or who are interested in solar.
                </p>
                <p>
                  This app was notably used as a support for a 2-week energy challenge in June 2019 for the people of Einsiedeln in
                  Switzerland.
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
                  <a href="http://ourenergy.ch" rel="noopener noreferrer">
                    Progressive Web Apps
                  </a>
                  ,{' '}
                  <a href="https://itunes.apple.com/app/id1453497591" rel="noopener noreferrer">
                    Apple Store
                  </a>{' '}
                  and{' '}
                  <a href="http://play.google.com/store/apps/details?id=ch.ourenergy.ourenergy" rel="noopener noreferrer">
                    Google Play
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href="http://www.ia.arch.ethz.ch/our-energy/" rel="noopener noreferrer">
                    {' '}
                    iA, Chair of Information Architecture, ETH Zürich
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <strong>Technology:</strong>{' '}
                  <a href="http://ionicframework.com" rel="noopener noreferrer">
                    Ionic
                  </a>
                  ,{' '}
                  <a href="http://angular.io" rel="noopener noreferrer">
                    Angular
                  </a>{' '}
                  and{' '}
                  <a href="http://cordova.apache.org" rel="noopener noreferrer">
                    Cordova
                  </a>
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
          </main>
        </section>

        <Projects filter={'ourenergy'} />
      </Layout>
    );
  }
}

const OurEnergyPageQuery = () => (
  <StaticQuery
    query={graphql`
      {
        ourEnergyImage: file(relativePath: {eq: "portfolio/ourenergy-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        ourEnergyScreenshot1: file(relativePath: {eq: "portfolio/ourenergy/screenshot1.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        ourEnergyScreenshot2: file(relativePath: {eq: "portfolio/ourenergy/screenshot2.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        ourEnergyScreenshot3: file(relativePath: {eq: "portfolio/ourenergy/screenshot3.png"}) {
          childImageSharp {
            gatsbyImageData(width: 540, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    `}
    render={(data) => <OurEnergyPage data={data} />}
  />
);

export default OurEnergyPageQuery;

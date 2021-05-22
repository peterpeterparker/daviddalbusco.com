import React from 'react';
import Seo from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Projects from '../../components/projects/projects';

class BonjourCirclePage extends React.Component {
  render() {
    return (
      <Layout fixNav={true}>
        <Seo title="Bonjour - Circle" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.bonjourCircleImage.childImageSharp.gatsbyImageData}>
              <h1>Bonjour - Circle</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I developed several components and applications for{' '}
                  <a href="https://www.customfuture.com" rel="noopener noreferrer">
                    customfuture SA
                  </a>{' '}
                  and "Bonjour".
                </p>
                <p>
                  One of these, called "OneCircle", is the upcoming app that asks “Bonjour! How are you today?” on a daily basis and then
                  informs close relatives.
                </p>
                <p>
                  "Bonjour" is a charity "Think-and-do Tank" projects, an incubator for idea, tools and impulse for a better self-determined
                  life.
                </p>
                <p>Their goal is to work together for a better future.</p>
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
                  <strong>Website:</strong>{' '}
                  <a href="https://bonjour.help" rel="noopener noreferrer">
                    {' '}
                    Bonjour.help
                  </a>
                </p>
              </div>
              <div>
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

        <Projects filter={'bonjour-circle'} />
      </Layout>
    );
  }
}

const BonjourCirclePageQuery = () => (
  <StaticQuery
    query={graphql`
      {
        bonjourCircleImage: file(relativePath: {eq: "portfolio/bonjour-circle-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    `}
    render={(data) => <BonjourCirclePage data={data} />}
  />
);

export default BonjourCirclePageQuery;

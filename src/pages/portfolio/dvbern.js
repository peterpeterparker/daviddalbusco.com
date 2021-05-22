import React from 'react';
import SEO from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Projects from '../../components/projects/projects';

class DVBernPage extends React.Component {
  render() {
    return (
      <Layout fixNav={true}>
        <SEO title="DV Bern AG" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.dvbImage.childImageSharp.gatsbyImageData}>
              <h1>DV Bern AG</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>
                  I had the pleasure of collaborating again with{' '}
                  <a href="https://www.dvbern.ch" rel="noopener noreferrer">
                    DV Bern AG
                  </a>
                  , a company by which I used to be employed, on a project related to the commercial register ("Handelsregister" / "Register
                  du commerce").
                </p>
                <p>DV Bern AG provides the most used ERP solution in Switzerland for such administrations.</p>
                <p>
                  The project's scope was the development of a new process which had an influence on both the online end clients of the
                  registers and the workflow of their employees.
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
                  <strong>Technology:</strong>{' '}
                  <a href="https://www.java.com" rel="noopener noreferrer">
                    Java
                  </a>
                  ,{' '}
                  <a href="https://jakarta.ee" rel="noopener noreferrer">
                    Jakarta EE
                  </a>{' '}
                  and{' '}
                  <a href="https://www.primefaces.org" rel="noopener noreferrer">
                    PrimeFaces
                  </a>
                </p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href="https://dvbern.ch" rel="noopener noreferrer">
                    {' '}
                    dvbern.ch
                  </a>
                </p>
              </div>
              <div>
                <p>
                  <strong>Infrastructure:</strong> DV Bern AG provides its own IT-Services solution
                </p>
                <p>
                  <strong>Database:</strong>{' '}
                  <a href="https://www.postgresql.org" rel="noopener noreferrer">
                    PostgreSQL
                  </a>
                </p>
              </div>
            </article>
          </main>
        </section>

        <Projects filter={'dvb'} />
      </Layout>
    );
  }
}

const DVBernPageQuery = () => (
  <StaticQuery
    query={graphql`
      {
        dvbImage: file(relativePath: {eq: "portfolio/dvb-icon.png"}) {
          childImageSharp {
            gatsbyImageData(width: 240, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
      }
    `}
    render={(data) => <DVBernPage data={data} />}
  />
);

export default DVBernPageQuery;

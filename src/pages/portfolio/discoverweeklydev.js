import React from 'react';
import SEO from '../../components/seo/seo';
import Layout from '../../components/layout/layout';
import {graphql, StaticQuery} from 'gatsby';

import Chapter from '../../components/chapter/chapter';
import Projects from '../../components/projects/projects';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {debounce} from '@deckdeckgo/utils';

class DiscoverWeeklyDevPage extends React.Component {
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
        <SEO title="DiscoverWeekly.dev" />

        <section className="project extrabigspace">
          <main>
            <Chapter img={this.props.data.discoverweeeklydevDarkImage.childImageSharp.fluid}>
              <h1>DiscoverWeekly.dev</h1>
            </Chapter>

            <article className="info">
              <div>
                <p>I miss discovering random music in a totally unpredictably way and not though algorithm.</p>
                <p>
                  That's why, I created{' '}
                  <a href="https://discoverweekly.dev" rel="noopener noreferrer">
                    DiscoverWeekly.dev
                  </a>
                  , a place where developers can share their favorite music by contributing to an open source repo.
                </p>

                <p>
                  This project was also for me a way to try out the usage of{' '}
                  <a href="https://tailwindcss.com/" rel="noopener noreferrer">
                    Tailwind CSS
                  </a>{' '}
                  on a larger application, test some{' '}
                  <a href="https://vercel.com" rel="noopener noreferrer">
                    Vercel
                  </a>{' '}
                  features I had on my bucket list and, finally, develop my first{' '}
                  <a href="https://threejs.org/" rel="noopener noreferrer">
                    ThreeJS
                  </a>{' '}
                  3d animated scene.
                </p>
              </div>

              <iframe
                title="Rebel Scan demo"
                src="https://www.youtube.com/embed/uohpcHeR_E8"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
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
                  <a href="http://discoverweekly.dev" rel="noopener noreferrer">
                    Progressive Web Apps
                  </a>
                </p>
                <p>
                  <strong>Technology:</strong>{' '}
                  <a href="https://nextjs.org/" rel="noopener noreferrer">
                    Next.js
                  </a>{' '}
                  and <a href="https://reactjs.org/">React</a>
                </p>
              </div>

              <div>
                <p>
                  <strong>Infrastructure:</strong>{' '}
                  <a href="https://vercel.com" rel="noopener noreferrer">
                    Vercel
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
                <a href="https://github.com/peterpeterparker/discoverweekly.dev" rel="noopener noreferrer">
                  GitHub
                  <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
              </p>
            </article>
          </main>
        </section>

        <Projects filter={'discoverweeklydev'} />
      </Layout>
    );
  }
}

const DiscoverWeeklyDevPageQuery = () => (
  <StaticQuery
    query={graphql`
      query {
        discoverweeeklydevDarkImage: file(relativePath: {eq: "portfolio/discoverweeklydev-dark-icon.png"}) {
          childImageSharp {
            fluid(maxWidth: 240) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={(data) => <DiscoverWeeklyDevPage data={data} />}
  />
);

export default DiscoverWeeklyDevPageQuery;

import React from 'react';

import './header.scss';

import {graphql, StaticQuery} from 'gatsby';
import {GatsbyImage} from 'gatsby-plugin-image';

import Chapter from '../chapter/chapter';

class Header extends React.Component {
  render() {
    return (
      <section className="header">
        <main>
          <GatsbyImage alt="" role="presentation" image={this.props.data.placeholderImage.childImageSharp.gatsbyImageData} />

          <Chapter icon="robot">
            <h1>David Dal Busco</h1>
          </Chapter>

          <p>Freelance Web Developer - Web, PWA and Mobile</p>
          <p>Project management - UX and IT consulting</p>
        </main>
      </section>
    );
  }
}

const header = () => (
  <StaticQuery
    query={graphql`
      {
        placeholderImage: file(relativePath: {eq: "daviddalbusco.jpg"}) {
          childImageSharp {
            gatsbyImageData(width: 480, layout: CONSTRAINED, placeholder: BLURRED)
          }
        }
        site {
          siteMetadata {
            description
          }
        }
      }
    `}
    render={(data) => <Header data={data} />}
  />
);
export default header;

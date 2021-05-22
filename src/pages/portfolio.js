import React from 'react';

import Layout from '../components/layout/layout';
import Seo from '../components/seo/seo';

import Projects from '../components/projects/projects';

class Portfolio extends React.Component {
  render() {
    return (
      <Layout fixNav={true}>
        <Seo title="Portfolio" />

        <Projects all={true} />
      </Layout>
    );
  }
}

export default Portfolio;

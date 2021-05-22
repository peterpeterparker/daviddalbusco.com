import React from 'react';

import Layout from '../components/layout/layout';
import Seo from '../components/seo/seo';

const NotFoundPage = () => (
  <Layout fixNav={true}>
    <Seo title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
);

export default NotFoundPage;

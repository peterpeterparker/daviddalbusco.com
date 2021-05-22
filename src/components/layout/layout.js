import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';

import '../../theme/variables.scss';
import '../../theme/main.scss';
import '../../theme/frame.scss';
import '../../theme/section.scss';
import '../../theme/blog.scss';
import '../../theme/project.scss';
import '../../theme/input.scss';
import '../../theme/fonts.scss';
import '../../theme/theme.scss';

import Navigation from '../navigation/navigation';
import Footer from '../footer/footer';

import {defineCustomElements as deckDeckGoLazyImgElement} from '@deckdeckgo/lazy-img/dist/loader';
import {defineCustomElements as deckDeckGoCoreElement} from '@deckdeckgo/core/dist/loader';
import {defineCustomElements as deckDeckGoSlideTitleElement} from '@deckdeckgo/slide-title/dist/loader';
import {defineCustomElements as deckDeckGoYoutubeElement} from '@deckdeckgo/youtube/dist/loader';
import {defineCustomElements as deckDeckGoHighlightElement} from '@deckdeckgo/highlight-code/dist/loader';

deckDeckGoLazyImgElement();
deckDeckGoCoreElement();
deckDeckGoSlideTitleElement();
deckDeckGoYoutubeElement();
deckDeckGoHighlightElement();

const Layout = ({children, fixNav}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Navigation siteTitle={data.site.siteMetadata.title} fix={fixNav} />

      {children}

      <Footer />
    </>
  );
};

export default Layout;

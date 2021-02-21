import React from 'react';

import Chapter from '../chapter/chapter';

import './about.scss';

import {Link} from 'gatsby';

class About extends React.Component {
  render() {
    return (
      <section className="about extraspace" id="about">
        <main className="small">
          <Chapter icon="address-card">
            <h2>About</h2>
          </Chapter>

          <p>
            Hey, nice to meet you{' '}
            <span role="img" aria-label="Hello">
              👋
            </span>
            .
          </p>
          <p>
            I'm a freelance web developer based in Zürich, Switzerland. I am experienced with{' '}
            <mark>
              <a href="http://ionicframework.com">Ionic</a>
            </mark>
            ,{' '}
            <mark>
              <a href="http://angular.io">Angular</a>
            </mark>
            ,{' '}
            <mark>
              <a href="https://reactjs.org">React</a>
            </mark>
            . I developed this website with{' '}
            <mark>
              <a href="https://gatsbyjs.com">Gatsby</a>
            </mark>{' '}
            and I'm a huge fan of{' '}
            <mark>
              <a href="https://stenciljs.com">StencilJS</a>
            </mark>{' '}
            Web Components.
          </p>
          <p>
            Throughout my career I also gathered experience in project management, analysis of business requirements and UX design (from a
            developer perspective).
          </p>
          <p>
            I have a computer engineering degree and an executive master in business administration. I speak fluently French, German and
            English.
          </p>
          <p>You could hire me as a contractor, to be part of your team, or ask me to take over your overall projects.</p>
          <p>
            If you have got a Web, Progressive Web Apps or mobile (iOS/Android) project in mind,{' '}
            <mark>
              <Link to="/#contact">get in touch!</Link>
            </mark>
          </p>
        </main>
      </section>
    );
  }
}

export default () => <About />;

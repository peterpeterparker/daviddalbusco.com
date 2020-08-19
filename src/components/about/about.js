import React from "react"

import Chapter from "../chapter/chapter"

import "./about.scss"

import { Link } from "gatsby"

class About extends React.Component {

  render() {
    return <section className="about extraspace" id="about">
      <main className="small">
        <Chapter icon="address-card">
          <h2>About</h2>
        </Chapter>

        <p>Hey, nice to meet you <span role="img" aria-label="Hello">👋</span>.</p>
        <p>I'm a freelance web developer. I am experienced with <mark><a href="http://ionicframework.com">Ionic</a></mark>, <mark><a href="http://angular.io">Angular</a></mark>, <mark><a href="https://reactjs.org">React</a></mark> and I'm a huge fan of <mark><a href="https://stenciljs.com">StencilJS</a></mark> Web Components.</p>
        <p>After my engineering degree, I spent many years collaborating on Java projects, which probably explains why I like to use <mark><a href="https://www.typescriptlang.org">TypeScript</a></mark> and why I can understand backend developers <span role="img" aria-label="Wink">😉</span>.</p>
        <p>I also have got experience in project management, analysis of business requirements and I used to be a team lead. I also provide UX and IT consulting.</p>
        <p>I speak fluently French, German and English and I'm currently based in Zürich, Switzerland.</p>
        <p>You could hire me as a contractor, to be part of your team, or ask me to take over your overall projects.</p>
        <p>If you have got a Web, Progressive Web Apps or mobile (iOS/Android) project in mind, <mark><Link to="/#contact">get in touch!</Link></mark></p>
      </main>
    </section>
  }
}

export default () => (
  <About/>
)

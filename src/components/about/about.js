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

        <p>I'm a freelance full stack developer specialized in Web, Progressive Web Apps and Mobile (iOS/Android) projects.</p>
        <p>In terms of development, I'm experienced with <mark><a href="http://ionicframework.com">Ionic</a></mark>, <mark><a href="http://angular.io">Angular</a></mark> and newly <mark><a href="https://reactjs.org">React</a></mark>. I'm a huge fan of Web Components developed with <mark><a href="https://stenciljs.com">StencilJS</a></mark> and I have a <mark><a href="https://www.java.com">Java</a></mark> background, which probably explains why I like to use <mark><a href="https://www.typescriptlang.org">Typescript</a></mark>.</p>
        <p>I also have got experience in project management, business requirements analysis, used to be a team lead and provide UX and IT consulting.</p>
        <p>I speak fluently french, german and english and I'm currently based in Zürich, Switzerland.</p>
        <p>You could hire me as a contractor to be part of your team or ask me to take over your overall project, as I did with some of the projects I showcase in my portfolio.</p>
      </main>
    </section>
  }
}

export default () => (
  <About/>
)

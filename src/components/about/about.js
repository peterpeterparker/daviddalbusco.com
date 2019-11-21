import React from "react"
import Chapter from "../chapter/chapter"

import "./about.scss"

class About extends React.Component {

  render() {
    return <section className="about extraspace" id="about">
      <main className="small">
        <Chapter icon="address-card">
          <h2>About</h2>
        </Chapter>

        <p>I'm a freelancer, full stack developer specialized in <mark>Web</mark>, <mark>Progressive Web Apps</mark> and <mark>Mobile iOS/Android</mark> projects. I've got experience in project management and team lead. I also provide UX and IT consulting.</p>
        <p>In terms of development, my favorite languages, which I'm experienced with, are <mark><a href="https://stenciljs.com">StencilJS</a></mark>, <mark><a href="http://ionicframework.com">Ionic</a></mark>, <mark><a href="http://angular.io">Angular</a></mark> and <mark><a href="https://www.java.com">Java</a></mark>.</p>
        <p>I speak fluently french, german and english and I'm currently based in Zürich, Switzerland.</p>
        <p>You could hire me as a contractor to work closely with your team or ask me to take over your overall project as I did with most of the projects I showcase in my portfolio.</p>
      </main>
    </section>
  }
}

export default () => (
  <About/>
)

import React from "react"
import Chapter from "../chapter/chapter"

import "./about.scss"

class About extends React.Component {

  render() {
    return <section className="about">
      <main>
        <Chapter icon="address-card">
          <h2>About</h2>
        </Chapter>

        <p>I'm a freelancer, full stack developer specialized in <mark>Web</mark>, <mark>Progressive Web Apps</mark> and <mark>Mobile iOS/Android</mark> projects. I've got experience in project management and team lead. I also provide UX and IT consulting.</p>
        <p>You could hire my services to work closely with your team or ask me to take over your overall project as I did with the projects I showcase in my portfolio.</p>
        <p>I speak fluently french, german and english and I'm currently based in Zürich, Switzerland.</p>
      </main>
    </section>
  }
}

export default () => (
  <About/>
)

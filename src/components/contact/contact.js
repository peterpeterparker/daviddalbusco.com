import React from "react"
import Chapter from "../chapter/chapter"

import "./contact.scss"

class Contact extends React.Component {

  render() {
    return <section className="contact extraspace">
      <main className="small">
        <Chapter icon="envelope">
          <h2>Contact</h2>
        </Chapter>

        <form action="https://formspree.io/david@fluster.io" method="POST">

          <input type="text" name="name" placeholder="Your name"/>
          <input type="email" name="_replyto" placeholder="Your email"/>
          <input type="tel" name="phone" placeholder="Your phone"/>
          <textarea name="message" placeholder="Your message" rows="4"></textarea>

          <input type="text" name="_gotcha" style={{ display: "none" }}/>
          <input type="hidden" name="_next" value="https://daviddalbusco.com" />

          <div className="action">
            <input type="submit" value="Send"/>
          </div>

        </form>
      </main>
    </section>
  }
}

export default () => (
  <Contact/>
)

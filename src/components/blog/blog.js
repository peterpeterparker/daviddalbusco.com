import React from "react"

import "./blog.scss"
import Chapter from "../chapter/chapter"

class Blog extends React.Component {

  render() {
    return <section className="blog">
      <main>
        <Chapter icon="newspaper">
          <h2>Blog</h2>
        </Chapter>
      </main>
    </section>
  }
}

export default () => (
  <Blog/>
)

import React from "react"
import { Link } from "gatsby"

import "./post.scss"

class Post extends React.Component {

  render() {
    return <>{this.renderPost()}</>
  }

  renderPost() {
    if (this.props.node && this.props.node.frontmatter) {
      return <Link to={this.props.node.frontmatter.path} className="post" aria-label={this.props.node.frontmatter.title}>
        <article>
          <div className="image">
            <deckgo-lazy-img img-src={this.props.node.frontmatter.image} img-alt={this.props.node.frontmatter.title}/>

            <div>
              <p>Read the article</p>
            </div>
          </div>

          <div className="details">
            <h2>{this.props.node.frontmatter.title}</h2>
            <p>{this.props.node.frontmatter.date}</p>
            <p>{this.props.node.frontmatter.tags}</p>
          </div>
        </article>
      </Link>
    } else {
      return undefined;
    }
  }
}

export default ({node}) => (
  <Post node={node}/>
)

import React from "react"

import "./blog.scss"
import Chapter from "../chapter/chapter"
import { graphql, Link, StaticQuery } from "gatsby"

class Blog extends React.Component {

  render() {
    const postList = this.props.data.allMarkdownRemark;

    return <section className="blog extraspace">
      <main>
        <Chapter icon="newspaper">
          <h2>Blog</h2>
        </Chapter>

        {postList.edges.map(({ node }, i) => (
          <Link to={node.frontmatter.path} key={i} className="link" >
            <div className="post-list">
              <h1>{node.frontmatter.title}</h1>
              <span>{node.frontmatter.date}</span>
            </div>
          </Link>
        ))}
      </main>
    </section>
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query ListQuery {
        allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 3) {
          edges {
            node {
              frontmatter {
                date(formatString: "MMMM Do YYYY")
                title,
                path
              }
            }
          }
        }
      }
    `}
    render={(data) => (
      <Blog data={data}/>
    )}
  />
)

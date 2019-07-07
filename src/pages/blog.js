import React from "react"
import { graphql, StaticQuery } from "gatsby"

import Layout from "../components/layout/layout"
import SEO from "../components/seo/seo"
import Chapter from "../components/chapter/chapter"
import Post from "../components/post/post"

class BlogPage extends React.Component {

  render() {
    const postList = this.props.data.allMarkdownRemark;

    return <Layout fixNav={true}>
      <SEO title="Blog" />

      <section className="blog extrabigspace">
        <main>
          <Chapter icon="newspaper">
            <h2>Blog</h2>
          </Chapter>

          {postList.edges.map(({ node }, i) => (
            <Post node={node} key={i}/>
          ))}
        </main>
      </section>

    </Layout>
  }
}

export default () => (
  <StaticQuery
    query={graphql`
      query ListQueryAll {
        allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
          edges {
            node {
              frontmatter {
                date(formatString: "MMMM Do YYYY")
                title,
                path,
                image,
                description,
                tags
              }
            }
          }
        }
      }
    `}
    render={(data) => (
      <BlogPage data={data}/>
    )}
  />
)

import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/seo/seo"
import Layout from "../components/layout/layout"
import Blog from "../components/blog/blog"

export default function Template({data}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout fixNav={true}>
      <SEO title="Blog" />

      <section className="post">
        <main>
          <h1>{frontmatter.title}</h1>
          <p className="date">{frontmatter.date}</p>
          <p className="tags">{frontmatter.tags}</p>
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </main>
      </section>

      <Blog/>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title,
        path,
        image,
        description,
        tags
      }
    }
  }
`

import React from 'react';

import {graphql, StaticQuery, Link} from 'gatsby';

import Chapter from '../chapter/chapter';
import Post from '../post/post';

class Blog extends React.Component {
  render() {
    const postList = this.props.data.allMarkdownRemark;

    return (
      <section className="blog extraspace">
        <main>
          <Chapter icon="newspaper">
            <h2>Blog</h2>
          </Chapter>

          {postList.edges.map(({node}, i) => (
            <Post node={node} key={i} />
          ))}

          <Link to="/blog/" className="button">
            <h2>More articles</h2>
          </Link>
        </main>
      </section>
    );
  }
}

const blog = () => (
  <StaticQuery
    query={graphql`
      query ListQuery {
        allMarkdownRemark(sort: {order: DESC, fields: [frontmatter___date]}, limit: 3) {
          edges {
            node {
              frontmatter {
                date(formatString: "MMMM Do YYYY")
                title
                path
                image
                description
                tags
              }
              timeToRead
            }
          }
        }
      }
    `}
    render={(data) => <Blog data={data} />}
  />
);
export default blog;

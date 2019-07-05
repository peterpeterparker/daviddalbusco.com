import { graphql, Link, StaticQuery } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import "./navigation.scss"
import Img from "gatsby-image"

class Navigation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      scrolled: false,
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  }

  handleScroll = (_$event) => {
    const scrolledSize = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    this.setState({ scrolled: scrolledSize > 90 })
  }

  render() {
    return <section
      style={{
        marginBottom: `1.45rem`,
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1030,
      }}
      className={this.state.scrolled ? "navigation fix" : "navigation"}
    >
      <div className="container"
        style={{
          padding: `1.45rem 1.0875rem`,
        }}
      >
          <Link
            to="/"
            style={{
              color: `inherit`,
              textDecoration: `none`,
            }}
            className="main"
          >
            <Img fluid={this.props.data.placeholderImage.childImageSharp.fluid}/>

            <h3 style={{ margin: 0 }}>
              {this.props.siteTitle}
            </h3>
          </Link>
      </div>
    </section>
  }
}

Navigation.propTypes = {
  siteTitle: PropTypes.string,
}

Navigation.defaultProps = {
  siteTitle: ``,
}

export default ({siteTitle}) => (
  <StaticQuery
    query={graphql`
    query {
      placeholderImage: file(relativePath: { eq: "daviddalbusco-icon.png" }) {
        childImageSharp {
          fluid(maxWidth: 48) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `}
    render={(data) => (
      <Navigation data={data} siteTitle={siteTitle}/>
    )}
  />
)

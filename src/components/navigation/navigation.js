import { graphql, Link, StaticQuery } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import "./navigation.scss"
import Img from "gatsby-image"

import Menu from "../menu/menu"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
    const scrollTrigger = scrolledSize > 70
    if (this.state.scrolled !== scrollTrigger) {
      this.setState({ scrolled: scrollTrigger })
    }
  }

  render() {
    return <>
      <section
        style={{
          marginBottom: `1.45rem`,
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1030,
        }}
        className={this.props.fix ? "navigation fix" : (this.state.scrolled ? "navigation fix animated" : "navigation")}
      >
        <main
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
            className="home"
          >
            <Img fluid={this.props.data.placeholderImage.childImageSharp.fluid}/>

            <h3 style={{ margin: 0 }}>
              {this.props.siteTitle}
            </h3>
          </Link>

          <button className="menu" title="Menu" onClick={() => this.toggleMenu()}><FontAwesomeIcon icon={["fas", "bars"]} size="lg"/>
          </button>
        </main>
      </section>
      <Menu ref={el => this.childMenu = el}/>
    </>
  }

  toggleMenu() {
    this.childMenu.open()
  }
}

Navigation.propTypes = {
  siteTitle: PropTypes.string,
}

Navigation.defaultProps = {
  siteTitle: ``,
}

export default ({ siteTitle, fix }) => (
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
      <Navigation data={data} siteTitle={siteTitle} fix={fix}/>
    )}
  />
)

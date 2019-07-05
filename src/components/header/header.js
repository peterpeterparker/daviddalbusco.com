import React from "react"

import "./header.scss"

import { graphql, StaticQuery } from "gatsby"
import Img from "gatsby-image"

import Chapter from "../chapter/chapter"

class Header extends React.Component {

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
    const scrollRatio = scrolledSize / (window.innerHeight || window.screen.height);
    const scrollDegree = Math.min(170 + (scrollRatio * 360), 250);

    this.setState({ scrollDegree: scrollDegree })
  }

  render() {
    return <section className="header" style={{background: (this.state.scrollDegree > 0 ? `linear-gradient(${this.state.scrollDegree}deg, var(--color-primary), var(--color-secondary))` : undefined)}}>
      <main>
        <Img fluid={this.props.data.placeholderImage.childImageSharp.fluid}/>

        <Chapter icon="robot">
          <h1>David Dal Busco</h1>
        </Chapter>

        <p>{this.props.data.site.siteMetadata.description}</p>
      </main>
    </section>
  }
}

export default () => (
  <StaticQuery
    query={graphql`
    query {
      placeholderImage: file(relativePath: { eq: "daviddalbusco.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 480) {
            ...GatsbyImageSharpFluid
          }
        }
      },
      site {
        siteMetadata {
          description
        }
      }
    }
  `}
    render={(data) => (
      <Header data={data}/>
    )}
  />
)

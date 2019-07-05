import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import "./navigation.scss"

class Navigation extends React.Component {

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
      className={this.props.scrolled ? "navigation fix" : "navigation"}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h3 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `inherit`,
              textDecoration: `none`,
            }}
          >
            {this.props.siteTitle}
          </Link>
        </h3>
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

export default Navigation

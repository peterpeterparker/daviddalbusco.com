import React from "react"

import "./chapter.scss"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

class Chapter extends React.Component {

  render() {
    return <div className="chapter">
      {this.props.children}

      <div className="divider">
        <div></div>

        <FontAwesomeIcon icon={["fal", this.props.icon]} size="2x"/>

        <div></div>
      </div>
    </div>
  }

}

export default ({ children, icon }) => (
  <Chapter icon={icon}>
    {children}
  </Chapter>
)

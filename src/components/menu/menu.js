import React, { useImperativeHandle, useRef } from "react"

import "./menu.scss"
import { Link } from "gatsby"

class Menu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  render() {
    return (
      <div className={this.state.open ? "menu open" : "menu"} onClick={() => this.close()} ref={this.props.innerRef}>
        <Link to="/"><h1>Home</h1></Link>
      </div>
    )
  }

  close() {
    this.setState({ open: false })
  }

  open() {
    this.setState({ open: true })
  }

}

export default React.forwardRef((props, ref) => {
  const menuRef = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      menuRef.current.open();
    },

  }))

  return <Menu ref={menuRef} {...props}/>
})
//
// export default () => (
//   <Menu/>
// )

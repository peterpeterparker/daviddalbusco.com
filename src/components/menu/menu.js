import React, {useImperativeHandle, useRef} from 'react';

import './menu.scss';
import {Link} from 'gatsby';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <div
        role="button"
        tabIndex="0"
        className={this.state.open ? 'menu open' : 'menu'}
        onClick={() => this.close()}
        onKeyDown={() => this.close()}
        ref={this.props.innerRef}>
        <Link to="/">
          <h1>Home</h1>
        </Link>
        <Link to="/#portfolio">
          <h1>Portfolio</h1>
        </Link>
        <Link to="/#about">
          <h1>About</h1>
        </Link>
        <Link to="/blog">
          <h1>Blog</h1>
        </Link>
        <Link to="/#contact">
          <h1>Contact</h1>
        </Link>
      </div>
    );
  }

  close() {
    this.setState({open: false});
  }

  open() {
    this.setState({open: true});
  }
}

export default React.forwardRef((props, ref) => {
  const menuRef = useRef();

  useImperativeHandle(ref, () => ({
    open() {
      menuRef.current.open();
    },
  }));

  return <Menu ref={menuRef} {...props} />;
});
//
// export default () => (
//   <Menu/>
// )

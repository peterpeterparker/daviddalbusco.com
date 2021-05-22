import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {GatsbyImage} from 'gatsby-plugin-image';

import './chapter.scss';

class Chapter extends React.Component {
  render() {
    return (
      <div className="chapter">
        {this.props.children}

        <div className="divider">
          <div></div>

          {this.renderIcon()}
          {this.renderImg()}

          <div></div>
        </div>
      </div>
    );
  }

  renderIcon() {
    if (this.props.icon) {
      return <FontAwesomeIcon icon={['fas', this.props.icon]} size="2x" />;
    } else {
      return undefined;
    }
  }

  renderImg() {
    if (this.props.img) {
      return <GatsbyImage alt="" role="presentation" image={this.props.img} />;
    } else {
      return undefined;
    }
  }
}

export default ({children, icon, img}) => (
  <Chapter icon={icon} img={img}>
    {children}
  </Chapter>
);

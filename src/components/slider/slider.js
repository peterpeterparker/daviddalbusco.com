import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {GatsbyImage} from 'gatsby-plugin-image';

import './slider.scss';

class Slider extends React.Component {
  render() {
    return (
      <div className="slider">
        <button onClick={() => this.prevSlide()} aria-label="Previous slide">
          <FontAwesomeIcon icon={['fas', 'chevron-left']} size="3x" />
        </button>

        <div className="deck-container">
          <deckgo-deck embedded="true">{this.renderSlides()}</deckgo-deck>
        </div>

        <button onClick={() => this.nextSlide()} aria-label="Next slide">
          <FontAwesomeIcon icon={['fas', 'chevron-right']} size="3x" />
        </button>
      </div>
    );
  }

  renderSlides() {
    if (this.props && this.props.images) {
      return this.props.images.map((image, i) => {
        return (
          <deckgo-slide-title key={i}>
            <div slot="title">
              <GatsbyImage alt="" role="presentation" image={image} />
            </div>
          </deckgo-slide-title>
        );
      });
    } else {
      return undefined;
    }
  }

  async nextSlide() {
    const deck = document.querySelector('deckgo-deck');
    if (deck) {
      await deck.slideNext();
    }
  }

  async prevSlide() {
    const deck = document.querySelector('deckgo-deck');
    if (deck) {
      await deck.slidePrev();
    }
  }
}

const slider = ({images}) => <Slider images={images} />;
export default slider;

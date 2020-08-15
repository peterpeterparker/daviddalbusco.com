import React from "react"

import "./slider.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Img from "gatsby-image"

class Slider extends React.Component {

  render() {
    return <div className="slider">

      <button onClick={() => this.prevSlide()} aria-label="Previous slide"><FontAwesomeIcon icon={["fal", "chevron-left"]} size="3x"/></button>

      <div className="deck-container">
        <deckgo-deck embedded="true">
          {this.renderSlides()}
        </deckgo-deck>
      </div>

      <button onClick={() => this.nextSlide()} aria-label="Next slide"><FontAwesomeIcon icon={["fal", "chevron-right"]} size="3x"/></button>

    </div>
  }

  renderSlides() {
    if (this.props && this.props.images) {
      return (
        this.props.images.map(( image, i) => {
          return <deckgo-slide-title key={i}>
            <div slot="title">
              <Img fluid={image}/>
            </div>
          </deckgo-slide-title>
        })
      )
    } else {
      return undefined;
    }
  }

  async nextSlide() {
    const deck = document.querySelector("deckgo-deck")
    if (deck) {
      await deck.slideNext()
    }
  }

  async prevSlide() {
    const deck = document.querySelector("deckgo-deck")
    if (deck) {
      await deck.slidePrev()
    }
  }
}

export default ({images}) => (
  <Slider images={images}/>
)

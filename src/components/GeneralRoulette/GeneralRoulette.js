import React from 'react'
import PropTypes from 'prop-types'

import bg from './assets/unloader.png'

class GeneralRoulette extends React.PureComponent {
  render () {
    const { id, images, stopIdx, onStart, onStop, onSlowdown, style, size, innerSize, ...props } = this.props
    const renderImages = () => {
      return images.map((image, idx) => <img key={idx} src={image} style={{ width: `${innerSize}px` }} />)
    }
    return (
      <div {...props} style={Object.assign({}, { backgroundImage: `url(${bg})`, width: `${size}px`, height: `${size}px` }, style)}>
        <div id={id} style={{ display: 'none', height: `${innerSize || size}px`, margin: `${innerSize ? (size - 6 - innerSize) / 2 : 0}px` }}>
          {renderImages()}
        </div>
      </div>
    )
  }
}

GeneralRoulette.contextTypes = {
  router: PropTypes.object.isRequired
}

GeneralRoulette.propTypes = {
  id: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
  stopIdx: PropTypes.number,
  onStart: PropTypes.func,
  onStop: PropTypes.func,
  onSlowdown: PropTypes.func,
  style: PropTypes.object,
  size: PropTypes.number.isRequired,
  innerSize: PropTypes.number
}

export default GeneralRoulette

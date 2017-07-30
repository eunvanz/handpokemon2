import React from 'react'
import PropTypes from 'prop-types'
import keygen from 'keygenerator'

class Roulette extends React.Component {
  constructor (props) {
    super(props)
    this._startRoulette = this._startRoulette.bind(this)
  }
  componentDidMount () {
    this._startRoulette()
  }
  shouldComponentUpdate (nextProps, nextState) {
    if (!this.props.stop && nextProps.stop) {
      window.$(`#${this.props.id}`).roulette('stop')
      return false
    } else {
      return true
    }
  }
  _startRoulette () {
    const $ = window.$
    if ($(`#${this.props.id} img`).length < this.props.images.length) {
      setTimeout(() => this._startRoulette(), 500)
    } else {
      const option = {
        speed: 8,
        duration: 10,
        stopImageNumber: this.props.stopIdx
      }
      $(`#${this.props.id}`).roulette(option).delay(this.props.delay || 0).roulette('start')
    }
  }
  render () {
    const { images, size, id, style, innerSize } = this.props
    const renderImages = () => {
      return images.map(image => <img src={image} key={keygen._()} style={{ width: `${innerSize || size}px`, height: `${innerSize || size}px` }} />)
    }
    return (
      <div style={Object.assign({}, { width: `${size}px`, height: `${size}px`, border: '3px solid #ddd' }, style)}>
        <div id={id} style={{ display: 'none', height: `${innerSize || size}px`, margin: `${innerSize ? (size - 6 - innerSize) / 2 : 0}px` }}>
          {renderImages()}
        </div>
      </div>
    )
  }
}

Roulette.contextTypes = {
  router: PropTypes.object.isRequired
}

Roulette.propTypes = {
  images: PropTypes.array.isRequired,
  stopIdx: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  delay: PropTypes.number,
  id: PropTypes.string.isRequired,
  style: PropTypes.object,
  innerSize: PropTypes.number,
  stop: PropTypes.bool.isRequired
}

export default Roulette

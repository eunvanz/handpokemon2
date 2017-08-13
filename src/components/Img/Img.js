import React from 'react'
import PropTypes from 'prop-types'
import ReactImage from 'react-image'

import placeholder from './assets/placeholder.png'

// import Loading from 'components/Loading'

class Img extends React.Component {
  render () {
    const { src, ...rest } = this.props
    const newSrc = [src, placeholder]
    return (
      <ReactImage src={newSrc} {...rest} loader={<img src={placeholder} style={{ width: '100%' }} />} />
    )
  }
}

Img.propTypes = {
  src: PropTypes.string.isRequired
}

export default Img

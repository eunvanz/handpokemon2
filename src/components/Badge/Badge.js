import React from 'react'
import PropTypes from 'prop-types'

import { creditBadgeStyle } from 'constants/styles'

class Badge extends React.Component {
  render () {
    const { color, text, className, style } = this.props
    return (
      <i className={`${className} bgm-${color}`} style={Object.assign({}, creditBadgeStyle, style)}>{text}</i>
    )
  }
}

Badge.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
}

export default Badge

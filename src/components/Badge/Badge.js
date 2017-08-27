import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import { creditBadgeStyle } from 'constants/styles'

class Badge extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (nextProps.color !== this.props.color) return true
    if (nextProps.text !== this.props.text) return true
    if (nextProps.className !== this.props.className) return true
    if (!is(fromJS(nextProps.style), fromJS(this.props.style))) return true
    return false
  }
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

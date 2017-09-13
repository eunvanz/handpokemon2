import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { levelBadgeStyle } from 'constants/styles'

class MonLevel extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    return (
      <div style={Object.assign({}, levelBadgeStyle, this.props.style)}>LV.{this.props.level}</div>
    )
  }
}

MonLevel.propTypes = {
  level: PropTypes.number.isRequired,
  style: PropTypes.object
}

export default MonLevel

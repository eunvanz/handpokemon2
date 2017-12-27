import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { levelBadgeStyle } from 'constants/styles'
import { colors } from 'constants/colors'

class MonLevel extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    return (
      <div style={Object.assign({}, levelBadgeStyle, this.props.style, this.props.isMaxLevel ? { backgroundColor: colors.indigo } : {})}>LV.{this.props.level}</div>
    )
  }
}

MonLevel.propTypes = {
  level: PropTypes.number.isRequired,
  style: PropTypes.object,
  isMaxLevel: PropTypes.bool
}

export default MonLevel

import React from 'react'
import PropTypes from 'prop-types'

import { levelBadgeStyle } from 'constants/styles'

class MonLevel extends React.Component {
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

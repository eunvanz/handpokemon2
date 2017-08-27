import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import { levelBadgeStyle } from 'constants/styles'

class MonLevel extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props))
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

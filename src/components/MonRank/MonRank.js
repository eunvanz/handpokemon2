import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { rankBadgeStyle } from 'constants/styles'

class MonRank extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { rank, style } = this.props
    return (
      <div style={Object.assign({}, rankBadgeStyle(rank), style)}>{rank}</div>
    )
  }
}

MonRank.propTypes = {
  rank: PropTypes.string.isRequired,
  style: PropTypes.object
}

export default MonRank

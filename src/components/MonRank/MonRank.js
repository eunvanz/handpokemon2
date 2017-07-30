import React from 'react'
import PropTypes from 'prop-types'

import { rankBadgeStyle } from 'constants/styles'

class MonRank extends React.Component {
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

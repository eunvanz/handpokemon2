import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, is } from 'immutable'

import { rankBadgeStyle } from 'constants/styles'

class MonRank extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !is(fromJS(nextProps), fromJS(this.props))
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

import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import classNames from 'classnames'

import { rankBadgeStyle } from 'constants/styles'

class MonRank extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { rank, style, className, blink } = this.props
    return (
      <div className={classNames({ 'blink-opacity': blink, [className]: className })} style={Object.assign({}, rankBadgeStyle(rank), style)}>{rank}</div>
    )
  }
}

MonRank.propTypes = {
  rank: PropTypes.string.isRequired,
  style: PropTypes.object,
  blink: PropTypes.bool,
  className: PropTypes.string
}

export default MonRank

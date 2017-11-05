import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import { colors } from 'constants/colors'

class StatusBadge extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const { side, activeColor, icon, onClick, isActive, style } = this.props
    const basicStyle = {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '10px',
      lineHeight: '20px',
      background: isActive ? activeColor : colors.gray,
      color: 'white',
      top: '-30px',
      [side]: '5px',
      fontSize: '12px'
    }
    const mergedStyle = Object.assign({}, basicStyle, style)
    return (
      <div style={mergedStyle} onClick={onClick}>
        <i className={icon} />
      </div>
    )
  }
}

StatusBadge.contextTypes = {
  router: PropTypes.object.isRequired
}

StatusBadge.propTypes = {
  side: PropTypes.string, // default: 'left'
  activeColor: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  style: PropTypes.object
}

export default StatusBadge

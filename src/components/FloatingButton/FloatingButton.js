import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { isMobile } from 'utils/commonUtil'

import { colors } from 'constants/colors'

class FloatingButton extends React.Component {
  render () {
    const { right, bottom, backgroundColor, hidden, tooltipText, rotateIcon } = this.props
    const style = {
      right: right ? `${isMobile.any() ? right - 15 : right}px` : isMobile.any() ? '15px' : '40px',
      bottom: bottom ? `${isMobile.any() ? bottom - 20 : bottom}px` : isMobile.any() ? '20px' : '40px',
      backgroundColor: backgroundColor || colors.red,
      display: hidden ? 'none' : 'block',
      lineHeight: 1
    }
    const tooltip = (
      <Tooltip id='tooltip'>
        <strong>{tooltipText}</strong>
      </Tooltip>
    )
    if (isMobile.any()) {
      return (
        <button className='btn btn-float btn-danger m-btn waves-effect waves-circle waves-float'
          style={style}
          onClick={this.props.onClick}
        >
          <i className={this.props.iconClassName} />
        </button>
      )
    } else {
      return (
        <OverlayTrigger placement='left' overlay={tooltip} style={{ position: 'fixed' }}>
          <button className='btn btn-float btn-danger m-btn waves-effect waves-circle waves-float'
            style={style}
            onClick={this.props.onClick}
          >
            <i className={this.props.iconClassName} style={{ webkitTransform: `${rotateIcon ? 'rotate(45deg)' : 'none'}` }} />
          </button>
        </OverlayTrigger>
      )
    }
  }
}

FloatingButton.contextTypes = {
  router: PropTypes.object.isRequired
}

FloatingButton.propTypes = {
  iconClassName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  right: PropTypes.number,
  bottom: PropTypes.number,
  backgroundColor: PropTypes.string,
  hidden: PropTypes.bool,
  tooltipText: PropTypes.string,
  rotateIcon: PropTypes.bool
}

export default FloatingButton

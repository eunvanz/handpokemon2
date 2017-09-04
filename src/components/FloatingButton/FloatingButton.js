import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { isMobile } from 'utils/commonUtil'

import { colors } from 'constants/colors'

const transition = '.2s ease-out all'
class FloatingButton extends React.Component {
  constructor (props) {
    super(props)
    const { right, hidden, backgroundColor } = props
    this.state = {
      style: {
        right: right ? `${isMobile.any() ? right - 15 : right}px` : isMobile.any() ? '15px' : '40px',
        bottom: isMobile.any() ? '20px' : '40px',
        backgroundColor: backgroundColor || colors.red,
        lineHeight: 1,
        zIndex: hidden ? 1 : 1000,
        boxShadow: hidden ? '0 2px 5px rgba(0, 0, 0, 0), 0 2px 10px rgba(0, 0, 0, 0)' : '0 2px 5px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.12)'
      }
    }
  }
  componentWillUpdate (nextProps, nextState) {
    if (!nextProps.hidden && this.props.hidden) {
      const newStyle = {
        transform: `translate3d(0, -${this.props.bottom}px, 0)`, transition, zIndex: 999, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.16), 0 2px 10px rgba(0, 0, 0, 0.12)' }
      this.setState({ style: Object.assign({}, this.state.style, newStyle) })
    } else if (nextProps.hidden && !this.props.hidden) {
      const newStyle = { transform: `translate3d(0, 0, 0)`, transition, zIndex: 999, boxShadow: '0 2px 5px rgba(0, 0, 0, 0), 0 2px 10px rgba(0, 0, 0, 0)' }
      this.setState({ style: Object.assign({}, this.state.style, newStyle) })
    }
  }
  render () {
    const { tooltipText, rotateIcon } = this.props
    const tooltip = (
      <Tooltip id='tooltip'>
        <strong>{tooltipText}</strong>
      </Tooltip>
    )
    if (isMobile.any()) {
      return (
        <button className='btn btn-float btn-danger m-btn waves-effect waves-circle waves-float'
          style={this.state.style}
          onClick={this.props.onClick}
        >
          <i className={this.props.iconClassName} />
        </button>
      )
    } else {
      return (
        <OverlayTrigger placement='left' overlay={tooltip} style={{ position: 'fixed' }}>
          <button className='btn btn-float btn-danger m-btn waves-effect waves-circle waves-float'
            style={this.state.style}
            onClick={this.props.onClick}
          >
            <i className={this.props.iconClassName}
              style={{ WebkitTransform: `${rotateIcon ? 'rotate(45deg)' : 'none'}`, transform: `${rotateIcon ? 'rotate(45deg)' : 'none'}` }} />
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

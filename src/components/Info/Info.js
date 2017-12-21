import React from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Popover } from 'react-bootstrap'

class Info extends React.PureComponent {
  render () {
    const { id, title, content } = this.props
    const popover = (
      <Popover id={id} title={title} style={{ zIndex: '1050', fontSize: '14px' }}>
        {content}
      </Popover>
    )
    return (
      <OverlayTrigger trigger='click' placement='bottom' overlay={popover}>
        <small style={{ fontSize: '12px' }}><i className='fal fa-question-circle c-gray' style={{ cursor: 'pointer' }} /></small>
      </OverlayTrigger>
    )
  }
}

Info.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired
}

export default Info

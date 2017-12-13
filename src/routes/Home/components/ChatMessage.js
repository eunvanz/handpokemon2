import React from 'react'
import PropTypes from 'prop-types'

import Img from 'components/Img'

import { getThumbnailImageUrl } from 'utils/commonUtil'

class ChatMessage extends React.PureComponent {
  render () {
    const { chat, side, timeComponent } = this.props
    return (
      <div>
        {side === 'left' && <Img src={getThumbnailImageUrl(chat.writer.profileImage)} className='pull-left m-r-5' style={{ width: '50px', borderRadius: '50%' }} />}
        <div className={`mblm-item mblm-item-${side}`}>
          <div>
            {chat.content}
          </div>
          {
            side === 'left' &&
            <small className='p-l-5 p-r-5'>{chat.writer.nickname} &#183; {timeComponent}</small>
          }
          {
            side === 'right' &&
            <small className='p-l-5 p-r-5'>{timeComponent}</small>
          }
        </div>
      </div>
    )
  }
}

ChatMessage.propTypes = {
  chat: PropTypes.object.isRequired,
  side: PropTypes.string.isRequired,
  timeComponent: PropTypes.element.isRequired
}

export default ChatMessage

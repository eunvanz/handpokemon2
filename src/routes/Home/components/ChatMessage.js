import React from 'react'
import PropTypes from 'prop-types'

import Img from 'components/Img'

import { getThumbnailImageUrl } from 'utils/commonUtil'

import { getUserByUserId } from 'services/UserService'

class ChatMessage extends React.Component {
  constructor (props) {
    super(props)
    this._handleOnClickUserProfile = this._handleOnClickUserProfile.bind(this)
  }
  _handleOnClickUserProfile () {
    const { auth, firebase, setUserModal, chat } = this.props
    setUserModal({
      show: true,
      user: null,
      isMyself: false,
      isLoading: true
    })
    getUserByUserId(firebase, chat.writer.id)
    .then(user => {
      setUserModal({
        show: true,
        user,
        isLoading: false,
        isMyself: auth && auth.uid === chat.writer.id
      })
    })
  }
  render () {
    const { chat, side, timeComponent } = this.props
    return (
      <div>
        {side === 'left' && <Img src={getThumbnailImageUrl(chat.writer.profileImage)} className='pull-left m-r-5' style={{ width: '50px', borderRadius: '50%', cursor: 'pointer' }} />}
        <div className={`mblm-item mblm-item-${side}`}>
          <div>
            {chat.content}
          </div>
          {
            side === 'left' &&
            <small className='p-l-5 p-r-5' onClick={this._handleOnClickUserProfile} style={{ cursor: 'pointer' }}><span className='c-lightblue'>{chat.writer.nickname}</span> &#183; {timeComponent}</small>
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
  timeComponent: PropTypes.element.isRequired,
  setUserModal: PropTypes.func.isRequired,
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object
}

export default ChatMessage

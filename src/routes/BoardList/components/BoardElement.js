import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { findIndex } from 'lodash'
import { FormattedDate, FormattedTime } from 'react-intl'

import { getMsg, isScreenSize } from 'utils/commonUtil'

import Img from 'components/Img'
import Button from 'components/Button'

class BoardElement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showContent: false,
      showButtons: false
    }
    this._handleOnClickShowDetail = this._handleOnClickShowDetail.bind(this)
    this._handleOnFocusComment = this._handleOnFocusComment.bind(this)
    this._handleOnClickCancel = this._handleOnClickCancel.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickShowDetail () {
    this.setState({ showContent: true })
    // 조회수 증가 로직
  }
  _handleOnFocusComment () {
    this.setState({ showButtons: true })
  }
  _handleOnClickCancel () {
    this.setState({ showButtons: false })
  }
  render () {
    const { board, auth, user, message, locale } = this.props
    const { showContent, showButtons } = this.state
    const renderStatus = () => {
      return (
        <div className='wis-stats clearfix pull-right'>
          <div className='wis-numbers'>
            <span><i className='fa fa-eye' /> {board.views}</span>
            <span className={`${board.whoLikes && findIndex(board.whoLikes, o => o === auth.uid) > -1 ? 'active' : ''}`}>
              <i className='fa fa-heart' /> {board.likes}
            </span>
            <span><i className='fa fa-comments' /> {board.replies ? board.replies.length : 0}</span>
          </div>
        </div>
      )
    }
    const renderComments = () => {
      if (!board.replies || board.replies.length === 0) return <div className='list-group-item text-center media'>댓글이 없습니다. 첫 번째로 댓글을 달아보세요.</div>
    }
    return (
      <div className='col-xs-12' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        <div className='card w-item'>
          <div className='card-header'>
            <div className='media'>
              {
                !isScreenSize.xs() &&
                <div className='pull-left'>
                  <Img className='avatar-img' src={board.writer.profileImage} />
                </div>
              }
              {!isScreenSize.xs() && renderStatus()}
              <div className='media-body'>
                <h2 style={{ fontSize: '16px', marginBottom: '5px' }}>{board.title[locale]}</h2>
                <small className='c-gray'>
                  by {board.writer.nickname}
                  {
                    !isScreenSize.xs() &&
                    <span>
                      {` @`} <FormattedDate
                        value={new Date(board.modDate)}
                        year='numeric'
                        month='numeric'
                        day='2-digit'
                      /> <FormattedTime
                        value={new Date(board.modDate)}
                      />
                    </span>
                  }
                  {
                    isScreenSize.xs() &&
                    <span> | views: {board.views} | likes: {board.likes} | replies: {board.replies ? board.replies.length : 0}</span>
                  }
                </small>
              </div>
            </div>
          </div>
          {
            !showContent &&
            <div className='card-body card-padding'>
              {board.preview[locale] + (board.preview[locale].length === 50 ? '...' : '')}
              <div className='row'>
                <Button className='pull-right c-lightblue' icon='fa fa-caret-down' text='상세보기' link onClick={this._handleOnClickShowDetail} />
              </div>
            </div>
          }
          {
            showContent &&
            <div>
              <div className='card-body card-padding'>
                <div dangerouslySetInnerHTML={{ __html: board.content[locale] }} />
                <div className='row'>
                  <Button className='pull-right c-lightblue' icon='fa fa-caret-up' text='접기' link onClick={() => this.setState({ showContent: false })} />
                </div>
                <div className='text-center'><Button icon='fa fa-heart c-pink' text={String(board.likes)} color='white' /></div>
              </div>
              <div className='wi-comments'>
                <div className='list-group'>
                  {renderComments()}
                  <div className='wic-form toggled'>
                    <textarea placeholder='댓글을 적어주세요.' onFocus={this._handleOnFocusComment} />
                    {
                      showButtons &&
                      <div className='wicf-actions text-right'>
                        <Button link text='취소' onClick={this._handleOnClickCancel} />
                        <Button className='m-l-5' text='등록' />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

BoardElement.contextTypes = {
  router: PropTypes.object.isRequired
}

BoardElement.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  board: PropTypes.object.isRequired
}

export default BoardElement

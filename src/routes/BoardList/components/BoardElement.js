import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { findIndex } from 'lodash'
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl'
import { toast } from 'react-toastify'

import { getMsg, isScreenSize, isStringLength, convertMapToArr, showAlert } from 'utils/commonUtil'

import Img from 'components/Img'
import Button from 'components/Button'
// import Fold from 'components/Fold'

import { updateLikes, updateWhoLikes, postReply, deleteBoard, deleteReply, increaseViews } from 'services/BoardService'

import Reply from 'models/reply'

class BoardElement extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showContent: false,
      showButtons: false,
      isLikesLoading: false,
      isSaveReplyLoading: false,
      isEditLoading: false,
      isDeleteLoading: false,
      isDeleteReplyLoading: false,
      replyContent: ''
    }
    this._handleOnClickShowDetail = this._handleOnClickShowDetail.bind(this)
    this._handleOnFocusComment = this._handleOnFocusComment.bind(this)
    this._handleOnClickCancel = this._handleOnClickCancel.bind(this)
    this._handleOnClickLike = this._handleOnClickLike.bind(this)
    this._handleOnClickSaveReply = this._handleOnClickSaveReply.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickDelete = this._handleOnClickDelete.bind(this)
    this._handleOnClickEdit = this._handleOnClickEdit.bind(this)
    this._handleOnClickDeleteReply = this._handleOnClickDeleteReply.bind(this)
    this._handleOnClickClose = this._handleOnClickClose.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.board.likes !== this.props.board.likes) this.setState({ isLikesLoading: false })
    if (prevProps.board.replies !== this.props.board.replies) this.setState({ isSaveReplyLoading: false })
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnClickShowDetail (e) {
    e.stopPropagation()
    this.setState({ showContent: true })
    const { firebase, board, onChangeElement } = this.props
    increaseViews(firebase, board)
    onChangeElement()
  }
  _handleOnFocusComment (e) {
    e.stopPropagation()
    this.setState({ showButtons: true })
  }
  _handleOnClickCancel (e) {
    e.stopPropagation()
    this.setState({ showButtons: false })
  }
  _handleOnClickLike (e) {
    e.stopPropagation()
    const { auth, messages, locale, firebase, board, onChangeElement } = this.props
    if (!auth) return window.swal({ text: getMsg(messages.common.requiredLogin, locale) })
    this.setState({ isLikesLoading: true })
    if (findIndex(board.whoLikes, e => e === auth.uid) > -1) { // 이미 좋아요를 누른 경우
      updateLikes(firebase, board, -1)
        .then(() => {
          return updateWhoLikes(firebase, board, auth.uid, 'remove')
        })
        .then(() => {
          onChangeElement()
        })
    } else {
      updateLikes(firebase, board, 1)
        .then(() => {
          return updateWhoLikes(firebase, board, auth.uid, 'push')
        })
        .then(() => {
          onChangeElement()
        })
    }
  }
  _handleOnChangeInput (e) {
    e.stopPropagation()
    const value = e.target.value
    if (isStringLength(value) > 500) return
    this.setState({ replyContent: value })
  }
  _handleOnClickSaveReply (e) {
    e.stopPropagation()
    const { user, auth, firebase, board, onChangeElement } = this.props
    const { replyContent } = this.state
    if (replyContent.length === 0) window.swal({ text: '내용을 입력해주세요.' })
    this.setState({ isSaveReplyLoading: true })
    const reply = Object.assign({}, new Reply(), { writer: Object.assign({}, user, { id: auth.uid }), content: replyContent })
    postReply(firebase, reply, board)
    .then(() => {
      this.setState({ isSaveReplyLoading: false, replyContent: '', showButtons: false })
      toast('등록 완료!')
      onChangeElement()
    })
  }
  _handleOnClickDelete (e) {
    e.stopPropagation()
    const { firebase, board, onChangeElement } = this.props
    showAlert({
      title: '게시물이 삭제됩니다.',
      text: '정말 삭제하시겠습니까?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    })
    .then(() => {
      this.setState({ isDeleteLoading: true })
      deleteBoard(firebase, board)
      .then(() => {
        onChangeElement()
        toast('게시물이 삭제되었습니다.')
      })
    }, () => {})
  }
  _handleOnClickEdit (e) {
    e.stopPropagation()
    const { onClickEdit } = this.props
    onClickEdit()
  }
  _handleOnClickDeleteReply (reply) {
    const { firebase, board, onChangeElement } = this.props
    showAlert({
      title: '댓글이 삭제됩니다.',
      text: '정말 삭제하시겠습니까?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    })
    .then(() => {
      this.setState({ isDeleteReplyLoading: reply.id })
      deleteReply(firebase, reply, board)
      .then(() => {
        onChangeElement()
        toast('삭제 완료!')
      })
    }, () => {})
  }
  _handleOnClickClose (e) {
    e.stopPropagation()
    this.setState({ showContent: false })
  }
  render () {
    const { board, auth, user, message, locale } = this.props
    const { showContent, showButtons, isLikesLoading, replyContent, isSaveReplyLoading, isDeleteLoading, isEditLoading, isDeleteReplyLoading } = this.state
    const renderStatus = () => {
      return (
        <div className='wis-stats clearfix pull-right'>
          <div className='wis-numbers'>
            <span><i className='fa fa-eye' /> {board.views}</span>
            <span className={`${board.whoLikes && findIndex(board.whoLikes, o => o === auth.uid) > -1 ? 'active' : ''}`}>
              <i className='fa fa-heart' /> {board.likes}
            </span>
            <span><i className='fa fa-comments' /> {board.replies ? Object.keys(board.replies).length : 0}</span>
          </div>
        </div>
      )
    }
    const renderComments = () => {
      if (!showContent) return <div />
      if (!board.replies || Object.keys(board.replies).length === 0) return <div className='list-group-item text-center media'>댓글이 없습니다. 첫 번째로 댓글을 달아보세요.</div>
      else {
        return convertMapToArr(board.replies).map(reply => {
          return (
            <div className={`list-group-item media${isScreenSize.xs() ? ' p-15' : ''}`} key={reply.id}>
              <a className='pull-left'>
                <Img src={reply.writer.profileImage} className='lgi-img' />
              </a>
              <div className='media-body'>
                <a className='lgi-heading'>
                  {reply.writer.nickname}
                  <small className='c-gray m-l-10'>
                    <FormattedRelative value={new Date(reply.regDate)} />
                  </small>
                </a>
                <span style={{ fontSize: '14px' }}>
                  {reply.content} {reply.writer.id === auth.uid && <Button link loading={isDeleteReplyLoading === reply.id} text='삭제' size='xs' icon='fa fa-trash-alt' onClick={() => this._handleOnClickDeleteReply(reply)} />}
                </span>
              </div>
            </div>
          )
        })
      }
    }
    return (
      <div className='col-xs-12' style={{ padding: isScreenSize.sm() || isScreenSize.xs() ? '0px' : '0px 15px' }}>
        <div className='card w-item'>
          <div className={`card-header${isScreenSize.xs() ? ' p-15' : ''}`}>
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
                    <span> | views: {board.views} | likes: {board.likes} | replies: {board.replies ? Object.keys(board.replies).length : 0}</span>
                  }
                </small>
              </div>
            </div>
          </div>
          {
            !showContent &&
            <div className={`card-body card-padding${isScreenSize.xs() ? ' p-15' : ''}`} style={{ cursor: 'pointer' }} onClick={!showContent ? this._handleOnClickShowDetail : () => this.setState({ showContent: false })}>
              {board.preview[locale] + (board.preview[locale].length === 50 ? '...' : '')}
              <div className='row'>
                <Button className='pull-right c-lightblue' icon='fa fa-caret-down' text='상세보기' link onClick={this._handleOnClickShowDetail} />
              </div>
            </div>
          }
          {
            showContent &&
            <div>
              <div className={`card-body card-padding${isScreenSize.xs() ? ' p-15' : ''} p-t-0`}>
                <div dangerouslySetInnerHTML={{ __html: board.content[locale] }} />
                <div className='row'>
                  <Button className='pull-right c-lightblue' icon='fa fa-caret-up' text='접기' link onClick={this._handleOnClickClose} />
                </div>
                <div className='text-center'>
                  <Button onClick={this._handleOnClickLike}
                    disabled={isDeleteLoading || isEditLoading}
                    icon={isLikesLoading ? 'fa fa-sync fa-spin' : auth && findIndex(board.whoLikes, e => e === auth.uid) > -1 ? 'fas fa-heart c-pink' : 'far fa-heart c-pink'}
                    text={String(board.likes)} color='white'
                  />
                  {
                    board.writer.id === auth.uid &&
                    <span>
                      <Button onClick={this._handleOnClickDelete}
                        loading={isDeleteLoading}
                        icon='fa fa-trash-alt'
                        text='삭제' color='red'
                        className='m-l-5'
                        link
                      />
                      <Button onClick={this._handleOnClickEdit}
                        loading={isEditLoading}
                        icon='fa fa-edit'
                        text='수정' color='amber'
                        className='m-l-5'
                        link
                      />
                    </span>
                  }
                </div>
              </div>
              <div className='wi-comments'>
                <div className='list-group'>
                  {renderComments()}
                  <div className={`wic-form toggled${isScreenSize.xs() ? ' p-15' : ''}`}>
                    <textarea placeholder='댓글을 작성해주세요.' onFocus={this._handleOnFocusComment} onChange={this._handleOnChangeInput} value={replyContent} />
                    {
                      showButtons &&
                      <div className='wicf-actions text-right'>
                        <Button link text='취소' onClick={this._handleOnClickCancel} />
                        <Button disabled={replyContent.length === 0} loading={isSaveReplyLoading} onClick={this._handleOnClickSaveReply} className='m-l-5' text='등록' />
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
  board: PropTypes.object.isRequired,
  onChangeElement: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired
}

export default BoardElement

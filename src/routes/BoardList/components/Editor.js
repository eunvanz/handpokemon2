import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import ReactSummernote from 'react-summernote'
import $ from 'jquery'
import validator from 'validator'

import '../../../../node_modules/react-summernote/dist/react-summernote.css'
import '../../../../node_modules/bootstrap/js/modal'
import '../../../../node_modules/bootstrap/js/tooltip'

import { getMsg, isScreenSize, showAlert } from 'utils/commonUtil'

import Button from 'components/Button'
import CustomModal from 'components/CustomModal'
import Loading from 'components/Loading'
// import Fold from 'components/Fold'

import { postBoard, updateBoard } from 'services/BoardService'

import Board from 'models/board'

class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: '',
      title: '',
      showForm: false,
      isLoading: false,
      isUploadingImage: false,
      isEditMode: false
    }
    this._handleOnChangeContent = this._handleOnChangeContent.bind(this)
    this._handleOnImageUpload = this._handleOnImageUpload.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickTextarea = this._handleOnClickTextarea.bind(this)
    this._handleOnClickSave = this._handleOnClickSave.bind(this)
    this._handleOnClickCancel = this._handleOnClickCancel.bind(this)
  }
  componentDidMount () {
    const $ = window.$
    $('body').on('focus', '.fg-line .form-control', function () {
      $(this).closest('.fg-line').addClass('fg-toggled')
    })
    $('body').on('blur', '.form-control', function () {
      var p = $(this).closest('.form-group, .input-group')
      var i = p.find('.form-control').val()
      if (p.hasClass('fg-float')) {
        if (i.length === 0) {
          $(this).closest('.fg-line').removeClass('fg-toggled')
        }
      } else {
        $(this).closest('.fg-line').removeClass('fg-toggled')
      }
    })
  }
  componentDidUpdate (prevProps, prevState) {
    if (!prevState.showForm && this.state.showForm) $('#title').focus()
    if (prevProps.board !== this.props.board) {
      const { board } = this.props
      console.log('board', board)
      if (board) this.setState({ content: board.content[this.props.locale], title: board.title[this.props.locale], showForm: true })
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnChangeInput (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  _handleOnChangeContent (content) {
    this.setState({ content })
  }
  _handleOnImageUpload (file) {
    this.setState({ isUploadingImage: true })
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://api.imgur.com/3/image')
        xhr.setRequestHeader('Authorization', 'Client-ID 3573e0629638cc1')
        const data = new FormData()
        data.append('image', file[0])
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.link
          ReactSummernote.insertImage(url, $image => {
            $image.css('max-width', '100%')
          })
          this.setState({ isUploadingImage: false })
          resolve(response)
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          this.setState({ isUploadingImage: false })
          window.swal({ text: '이미지 업로드 도중 에러가 발생했습니다.' + error })
          reject(error)
        })
      }
    )
  }
  _handleOnClickTextarea () {
    this.setState({ showForm: true })
  }
  _handleOnClickSave () {
    const { auth, user, firebase, locale, onCompleteSave, category, messages, board } = this.props
    const { content, title, isEditMode } = this.state
    if (validator.isEmpty(content) || validator.isEmpty(title)) return window.swal({ text: getMsg(messages.board.emptyMessage, locale) })
    this.setState({ isLoading: true })
    const preview = content.replace(/(<([^>]+)>)/ig, '').slice(0, 50)
    const boardToSave = Object.assign({}, isEditMode ? board : new Board(), { writer: Object.assign({}, user, { id: auth.uid }), category, content: { [locale]: content }, title: { [locale]: title }, preview: { [locale]: preview } })
    let saveAction = isEditMode ? updateBoard : postBoard
    saveAction(firebase, boardToSave)
      .then(() => {
        ReactSummernote.reset()
        this.setState({ isLoading: false, content: '', title: '', showForm: false })
        onCompleteSave()
      })
  }
  _handleOnClickCancel () {
    const { content, title } = this.state
    const { onClickCancel } = this.props
    let alert = () => Promise.resolve()
    if (!validator.isEmpty(content) || !validator.isEmpty(title)) {
      alert = () => showAlert({
        title: '게시물이 작성이 취소됩니다.',
        text: '정말 취소하시겠습니까?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오'
      })
    }
    alert()
    .then(() => {
      onClickCancel()
      this.setState({ isEditMode: false, content: '', title: '', showForm: false })
    }, () => {})
  }
  render () {
    const { locale, messages } = this.props
    const { title, showForm, isLoading, isUploadingImage, isEditMode, content } = this.state
    return (
      <div className='card w-post'>
        <div className='card-body p-t-10'>
          <div className='container'>
            {
              showForm &&
              <div className='row'>
                <div className='col-xs-12'>
                  <div className='input-group m-b-20 w-100 p-t-15 p-l-15 p-r-15'>
                    <div className='fg-line'>
                      <input type='text' className='form-control'
                        placeholder={getMsg(messages.board.requestTitle, locale)}
                        value={title}
                        name='title'
                        id='title'
                        onChange={this._handleOnChangeInput} />
                    </div>
                  </div>
                </div>
              </div>
            }
            {
              !showForm &&
              <textarea className={`wp-text auto-size${isScreenSize.xs() ? ' p-l-0 p-r-0' : ' p-l-15 p-r-15'}`} placeholder='내용을 작성해주세요.' onClick={this._handleOnClickTextarea} />
            }
            {
              showForm &&
              <div className='row'>
                <div className='col-xs-12'>
                  <ReactSummernote
                    lang={locale}
                    value={content}
                    options={{
                      lang: locale,
                      height: 200,
                      dialogsInBody: true
                    }}
                    onChange={this._handleOnChangeContent}
                    onImageUpload={this._handleOnImageUpload}
                  />
                </div>
              </div>
            }
          </div>
          <div className='wp-actions clearfix text-right'>
            {
              showForm &&
              <Button text='취소' disabled={isLoading} link onClick={this._handleOnClickCancel} />
            }
            <Button loading={isLoading} disabled={!showForm} className='m-l-5' text={isEditMode ? '수정하기' : '등록하기'} icon='fa fa-check' onClick={this._handleOnClickSave} />
          </div>
        </div>
        <CustomModal
          bodyComponent={<Loading text='이미지 업로드 중...' className='p-t-20 p-b-20' />}
          show={isUploadingImage}
          width={250}
          id='loadingModal'
        />
      </div>
    )
  }
}

Editor.contextTypes = {
  router: PropTypes.object.isRequired
}

Editor.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  onCompleteSave: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  board: PropTypes.object,
  onClickCancel: PropTypes.func.isRequired
}

export default Editor

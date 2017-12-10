import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import ReactSummernote from 'react-summernote'
import $ from 'jquery'

import '../../../../node_modules/react-summernote/dist/react-summernote.css'
import '../../../../node_modules/bootstrap/js/modal'
import '../../../../node_modules/bootstrap/js/tooltip'
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.css'

import { getMsg } from 'utils/commonUtil'

import Button from 'components/Button'

import { postBoard } from 'services/BoardService'

import Board from 'models/board'

class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      content: '',
      title: '',
      showForm: false,
      isLoading: false
    }
    this._handleOnChangeContent = this._handleOnChangeContent.bind(this)
    this._handleOnImageUpload = this._handleOnImageUpload.bind(this)
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickTextarea = this._handleOnClickTextarea.bind(this)
    this._handleOnClickSave = this._handleOnClickSave.bind(this)
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
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _handleOnChangeInput (e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  _handleOnChangeContent (content) {
    console.log('onChange', content)
    this.setState({ content })
  }
  _handleOnImageUpload (file) {
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
          resolve(response)
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
  _handleOnClickTextarea () {
    this.setState({ showForm: true })
  }
  _handleOnClickSave () {
    this.setState({ isLoading: true })
    const { user, firebase, locale } = this.props
    const { content, title } = this.state
    const preview = content.replace(/(<([^>]+)>)/ig, '').slice(0, 50)
    const board = Object.assign({}, new Board(), { writer: user, content: { [locale]: content }, title: { [locale]: title }, preview: { [locale]: preview } })
    postBoard(firebase, board)
      .then(() => {
        ReactSummernote.reset()
        this.setState({ isLoading: false, content: '', title: '', showForm: false })
      })
  }
  render () {
    const { locale, messages } = this.props
    const { title, showForm, isLoading } = this.state
    return (
      <div className='card w-post'>
        <div className='card-body p-t-10'>
          <div className='container'>
            {
              showForm &&
              <div>
                <div className='row'>
                  <div className='col-xs-12'>
                    <div className='input-group m-b-20 w-100'>
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
                <div className='row'>
                  <div className='col-xs-12'>
                    <ReactSummernote
                      lang={locale}
                      value=''
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
              </div>
            }
            {
              !showForm &&
              <textarea className='wp-text auto-size p-l-15 p-r-15' placeholder='내용을 작성해주세요.' onClick={this._handleOnClickTextarea} />
            }
          </div>
          <div className='wp-actions clearfix text-right'>
            {
              showForm &&
              <Button text='취소' disabled={isLoading} link onClick={() => this.setState({ showForm: false })} />
            }
            <Button loading={isLoading} disabled={!showForm} className='m-l-5' text='등록하기' icon='fa fa-check' onClick={this._handleOnClickSave} />
          </div>
        </div>
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
  locale: PropTypes.string.isRequired
}

export default Editor

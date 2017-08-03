import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { fromJS } from 'immutable'
import validator from 'validator'

import { getSignInUser } from 'services/UserService'

import { showAlert } from 'utils/commonUtil'

class SignInView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        email: '',
        password: '',
        remember: false
      },
      process: false
    }
    this._handleOnChangeInput = this._handleOnChangeInput.bind(this)
    this._handleOnClickLogin = this._handleOnClickLogin.bind(this)
    this._checkEmailField = this._checkEmailField.bind(this)
    this._checkPasswordField = this._checkPasswordField.bind(this)
    this._loginProcess = this._loginProcess.bind(this)
  }
  componentDidMount () {
    if (this.props.user) this.context.router.push('/') // 로그인 상태일 경우 메인화면으로
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
    $('#input-password').keypress((e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        this._handleOnClickLogin(e)
      }
    })
  }
  _handleOnChangeInput (e) {
    e.preventDefault
    const { value, name } = e.target
    const formData = fromJS(this.state.formData)
    this.setState({ formData: formData.set(name, value).toJS() })
  }
  _checkEmailField () {
    const email = this.state.formData.email
    return !validator.isEmpty(email)
  }
  _checkPasswordField () {
    const password = this.state.formData.password
    return !validator.isEmpty(password)
  }
  _handleOnClickLogin (e) {
    e.preventDefault
    if (!this._checkEmailField() || !this._checkPasswordField()) {
      showAlert({
        confirmButtonText: '확인',
        title: 'OOPS!',
        text: '가입하신 이메일주소와 비밀번호를 입력하세요.',
        type: 'error'
      })
    } else {
      this._loginProcess()
    }
  }
  _loginProcess () {
    this.setState({ process: true })
    const { formData } = this.state
    getSignInUser(formData)
    .then(user => {
      this.props.receiveUser(user)
      this.setState({ process: false })
      this.context.router.push('/')
    })
    .catch(errMsg => {
      this.setState({ process: false })
      showAlert({
        confirmButtonText: '확인',
        title: 'OOPS!',
        text: errMsg,
        type: 'error'
      })
    })
  }
  render () {
    return (
      <div className='text-center'
        style={{ backgroundColor: '#f3f3f3', height: `${300}px`, minHeight: '300px' }}>
        <div className='lc-block toggled'>
          <div className='lcb-form'>
            <div className='input-group m-b-20'>
              <span className='input-group-addon'>
                <i className='fa fa-envelope' />
              </span>
              <div className='fg-line'>
                <input type='text' className='form-control' placeholder='이메일주소'
                  value={this.state.email}
                  name='email'
                  onChange={this._handleOnChangeInput} />
              </div>
            </div>
            <div className='input-group m-b-20'>
              <span className='input-group-addon'>
                <i className='fa fa-key' />
              </span>
              <div className='fg-line'>
                <input type='password' className='form-control' placeholder='비밀번호'
                  id='input-password'
                  value={this.state.password}
                  name='password'
                  onChange={this._handleOnChangeInput} />
              </div>
            </div>
            <div className='checkbox'>
              <label style={{ lineHeight: '1' }}>
                <input type='checkbox' value={this.state.remember}
                  onChange={this._handleOnChangeInput} name='remember' hidden='hidden' id='remember' />
                <i className='input-helper' style={{ top: '3px' }} /> <span style={{ fontSize: '14px' }}>자동로그인</span>
              </label>
            </div>
            <a onClick={this.state.process ? null : this._handleOnClickLogin}
              className={`btn btn-login btn-success btn-float waves-effect waves-circle waves-float`}
              style={{ lineHeight: '2.5em', marginTop: '-50px', cursor: this.state.process ? 'default' : 'pointer' }}>
              <i className={this.state.process ? 'fa fa-spinner fa-pulse fa-fw' : 'zmdi zmdi-arrow-forward'} />
            </a>
          </div>
          <div className='lcb-navigation'>
            <Link to='/sign-up' data-ma-block='#l-register'
              style={{ background: 'rgba(0, 150, 136, 1)' }}>
              <i className='zmdi zmdi-plus' />
              <span>회원가입</span>
            </Link>
            <Link to='' data-ma-block='#l-forget-password'
              style={{ background: 'rgba(0, 150, 136, 1)' }}>
              <i>?</i>
              <span>비밀번호찾기</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

SignInView.contextTypes = {
  router: PropTypes.object.isRequired
}

SignInView.propTypes = {
  user: PropTypes.object,
  receiveUser: PropTypes.func.isRequired
}

export default SignInView

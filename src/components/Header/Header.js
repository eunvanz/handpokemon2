import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { firebaseConnect } from 'react-redux-firebase'

import { showAlert } from 'utils/commonUtil'

import { logout } from 'services/UserService'

import logo from './assets/logo.png'

import withAuth from 'hocs/withAuth'

import { colors } from 'constants/colors'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this._handleOnClickLogout = this._handleOnClickLogout.bind(this)
  }
  _handleOnClickLogout () {
    showAlert({
      title: '로그아웃 하시겠습니까?',
      text: '정말로?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오'
    })
    .then(() => {
      // expireSessionUser()
      return logout(this.props.firebase)
      .then(() => {
        this.context.router.push('/')
        // showAlert({
        //   title: '다음에 또 보자구!',
        //   text: '로그아웃 되었습니다.',
        //   type: 'success'
        // })
        location.reload()
      })
      .catch(() => {
        showAlert({
          title: 'OOPS!',
          text: '로그아웃 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
          type: 'error'
        })
      })
    }, () => {})
  }
  render () {
    return (
      <header id='header' className='clearfix' style={{ backgroundColor: colors.lightBlue }}>
        <ul className='h-inner'>
          <li className='hi-trigger ma-trigger' data-ma-action='sidebar-open' data-ma-target='#sidebar'>
            <div className='line-wrap'>
              <div className='line top' />
              <div className='line center' />
              <div className='line bottom' />
            </div>
          </li>
          <li className='hi-logo visible-lg' style={{ top: '5px', position: 'absolute' }}>
            <Link to='/'><img src={logo} height={46} /></Link>
          </li>
          <li className='pull-right'>
            <ul className='hi-menu'>
              {
                !this.props.auth &&
                <li><Link to='/sign-up'><i className='him-icon zmdi zmdi-account-add' /></Link></li>
              }
              {
                !this.props.auth &&
                <li><Link to='/sign-in'><i className='him-icon zmdi zmdi-power' /></Link></li>
              }
              {
                this.props.auth &&
                <li><Link to='/settings'><i className='him-icon zmdi zmdi-settings' /></Link></li>
              }
              {
                this.props.auth &&
                <li><a style={{ cursor: 'pointer' }} onClick={this._handleOnClickLogout}><i className='him-icon zmdi zmdi-power' /></a></li>
              }
            </ul>
          </li>
        </ul>
      </header>
    )
  }
}

Header.contextTypes = {
  router: PropTypes.object.isRequired
}

Header.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object
}

const wrappedHeader = firebaseConnect()(Header)

export default withAuth(false)(wrappedHeader)

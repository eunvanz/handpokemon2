import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'

import { fetchUserById, clearUser } from 'store/user'

import { showAlert } from 'utils/commonUtil'

import { getSessionUser, expireSessionUser, logout } from 'services/UserService'

const mapStateToProps = (state) => ({
  auth: pathToJS(state.firebase, 'auth')
})

const mapDispatchToProps = {
  clearStoreUser: clearUser,
  fetchUserById: fetchUserById
}

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this._handleOnClickLogout = this._handleOnClickLogout.bind(this)
  }
  componentDidMount () {
    const authUser = getSessionUser()
    if (authUser) { // 세션에 authUser가 있을 경우 store에 세팅하고 db에서 user 가져옴
      this.props.fetchUserById(authUser.id)
    }
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
      expireSessionUser()
      return logout(this.props.firebase)
      .then(() => {
        showAlert({
          title: '다음에 또 보자구!',
          text: '로그아웃 되었습니다.',
          type: 'success'
        })
        this.context.router.push('/')
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
      <header id='header' className='clearfix' data-ma-theme='lightblue'>
        <ul className='h-inner'>
          <li className='hi-trigger ma-trigger' data-ma-action='sidebar-open' data-ma-target='#sidebar'>
            <div className='line-wrap'>
              <div className='line top' />
              <div className='line center' />
              <div className='line bottom' />
            </div>
          </li>
          <li className='hi-logo hidden-xs'>
            <Link to='/'>손켓몬2</Link>
          </li>
          <li className='pull-right'>
            <ul className='hi-menu'>
              {
                !this.props.auth &&
                <li><Link to='/sign-in'><i className='him-icon zmdi zmdi-sign-in' /></Link></li>
              }
              {
                !this.props.auth &&
                <li><Link to='/sign-up'><i className='him-icon zmdi zmdi-account-add' /></Link></li>
              }
              {
                this.props.auth &&
                <li><Link to='/sign-up'><i className='him-icon zmdi zmdi-settings' /></Link></li>
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
  clearStoreUser: PropTypes.func.isRequired,
  fetchUserById: PropTypes.func.isRequired,
  auth: PropTypes.object
}

const wrappedHeader = firebaseConnect([
  '/'
])(Header)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedHeader)

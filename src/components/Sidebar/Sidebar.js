import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import numeral from 'numeral'

import { DEFAULT_PROFILE_IMAGE_URL } from 'constants/urls'

import Badge from 'components/Badge'

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {
}

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    const { user } = this.props
    return (
      <aside id='sidebar' className='sidebar c-overflow mCustomScrollbar _mCS_1 mCS-autoHide'
        style={{ overflow: 'visible' }}>
        <div id='mCSB_1' className='mCustomScrollBox mCS-minimal-dark mCSB_vertical_horizontal mCSB_outside'
          style={{ maxHeight: 'none' }} tabIndex='0'>
          <div id='mCSB_1_container' className='mCSB_container mCS_x_hidden mCS_no_scrollbar_x'
            style={{ position: 'relative', top: '0px', left: '0px', width: '100%' }} dir='ltr'>
            <div className='s-profile'>
              <a data-ma-action='profile-menu-toggle'>
                <div className='sp-pic'>
                  <img src={user ? user.profile : DEFAULT_PROFILE_IMAGE_URL} className='mCS_img_loaded' />
                </div>
                <div className='sp-info' style={{ marginTop: '16px' }}>
                  {user ? user.nickname : '로그인을 해주세요.'} {user && <i className='zmdi zmdi-caret-down' />}
                </div>
              </a>
              { user &&
                <ul className='main-menu'>
                  <li className='text-center'>
                    <i className='fa fa-quote-left c-blue' /> {user.introduce} <i className='fa fa-quote-right c-blue' />
                  </li>
                </ul>
              }
            </div>
            <ul className='main-menu'>
              <li className='f-700'>
                <Link to='/'><i className='fa fa-home' style={{ fontSize: '22px' }} /> 홈</Link>
              </li>
              <li className='f-700'>
                <Link to='/'><i className='fa fa-bookmark' style={{ fontSize: '22px' }} /> 업적</Link>
              </li>
              <li className='f-700'>
                <Link to='/'><i className='fa fa-github-alt' style={{ fontSize: '22px' }} /> 내 콜렉션</Link>
              </li>
              <li className='f-700'>
                <Link to='/pick-district'>
                  <i className='fa fa-paw' style={{ fontSize: '22px' }} /> 포켓몬 채집
                  <Badge color='lightblue' text='10' />
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-map-o' style={{ fontSize: '22px' }} /> 포켓몬 탐험
                  <Badge color='lightblue' text='10' />
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-gamepad' style={{ fontSize: '22px' }} /> 포켓몬 시합
                  <Badge color='lightblue' text='1' />
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-shopping-cart' style={{ fontSize: '22px' }} /> 상점
                  <Badge color='amber' text={`${numeral(1000).format('0,0')}P`} />
                </Link>
              </li>
              <li className='sub-menu f-700'>
                <a style={{ cursor: 'pointer' }}
                  data-ma-action='submenu-toggle'><i className='fa fa-trophy' style={{ fontSize: '22px' }} /> 랭킹</a>
                <ul style={{ display: 'none' }}>
                  <li><Link to='/'>콜렉션 랭킹</Link></li>
                  <li><Link to='/'>시합 랭킹</Link></li>
                </ul>
              </li>
              <li className='sub-menu f-700'>
                <a style={{ cursor: 'pointer' }}
                  data-ma-action='submenu-toggle'><i className='fa fa-comments' style={{ fontSize: '22px' }} /> 커뮤니티</a>
                <ul style={{ display: 'none' }}>
                  <li><Link to='/'>공지사항</Link></li>
                  <li><Link to='/'>게시판</Link></li>
                </ul>
              </li>
              <li className='f-700'>
                <Link to='/'><i className='fa fa-paint-brush' style={{ fontSize: '22px' }} /> 포켓몬 공작소</Link>
              </li>
              <li className='f-700'>
                <Link to='/'><i className='fa fa-book' style={{ fontSize: '22px' }} /> 게임가이드</Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    )
  }
}

Sidebar.contextTypes = {
  router: PropTypes.object.isRequired
}

Sidebar.propTypes = {
  user: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)

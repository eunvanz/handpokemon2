import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { firebaseConnect } from 'react-redux-firebase'

import { DEFAULT_PROFILE_IMAGE_URL } from 'constants/urls'
import { PICK_CREDIT_REFRESH, BATTLE_CREDIT_REFRESH, ADVENTURE_CREDIT_REFRESH,
  MAX_PICK_CREDIT, MAX_BATTLE_CREDIT, MAX_ADVENTURE_CREDIT } from 'constants/rules'

import Badge from 'components/Badge'

import { refreshUserCredits, increaseCredit } from 'services/UserService'

import { convertTimeToMMSS, getAuthUserFromFirebase } from 'utils/commonUtil'

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state)
  }
}

const mapDispatchToProps = {
}

const timeouts = {}

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pickCreditTimer: null,
      battleCreditTimer: null,
      adventureCreditTimer: null
    }
    this._refreshUserCredits = this._refreshUserCredits.bind(this)
    this._handleCredit = this._handleCredit.bind(this)
    this._increaseCredit = this._increaseCredit.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    const { user } = this.props
    if (!prevProps.user && user) {
      this._refreshUserCredits()
    } else if (prevProps.user && user) {
      if (prevProps.user.pickCredit !== user.pickCredit) {
        clearTimeout(timeouts.pick)
        this._handleCredit(user, 'pick')
      } else if (prevProps.user.battleCredit !== user.battleCredit) {
        clearTimeout(timeouts.battle)
        this._handleCredit(user, 'battle')
      } else if (prevProps.user.adventureCredit !== user.adventureCredit) {
        clearTimeout(timeouts.adventure)
        this._handleCredit(user, 'adventure')
      }
    }
  }
  _refreshUserCredits () {
    const { firebase, auth, user } = this.props
    refreshUserCredits(firebase, auth.uid, user)
    .then(creditInfo => {
      this._handleCredit(creditInfo, 'pick')
      this._handleCredit(creditInfo, 'battle')
      this._handleCredit(creditInfo, 'adventure')
    })
  }
  _handleCredit (creditInfo, type) {
    const { pickCredit, lastPick, battleCredit, lastLeague, adventureCredit, lastAdventure } = creditInfo
    const handleByType = type => { // type = 'pick', 'battle', 'adventure'
      const currentTime = new Date().getTime()
      const interval = () => {
        if (type === 'pick') return PICK_CREDIT_REFRESH - (currentTime - lastPick)
        else if (type === 'battle') return BATTLE_CREDIT_REFRESH - (currentTime - lastLeague)
        else if (type === 'adventure') return ADVENTURE_CREDIT_REFRESH - (currentTime - lastAdventure)
      }
      const max = () => {
        if (type === 'pick') return MAX_PICK_CREDIT
        else if (type === 'battle') return MAX_BATTLE_CREDIT
        else if (type === 'adventure') return MAX_ADVENTURE_CREDIT
      }
      const credit = () => {
        if (type === 'pick') return pickCredit
        else if (type === 'battle') return battleCredit
        else if (type === 'adventure') return adventureCredit
      }
      if (credit() === 0) this._startCreditTimer(type, interval())
      else if (credit() < max()) {
        this.setState({ [`${type}CreditTimer`]: null })
        timeouts[type] = setTimeout(() => this._increaseCredit(type), interval())
      } else this.setState({ [`${type}CreditTimer`]: null })
    }
    handleByType(type)
  }
  _increaseCredit (type) {
    const { firebase, auth } = this.props
    increaseCredit(firebase, auth.uid, 1, type)
  }
  _startCreditTimer (type, interval) {
    const timer = setInterval(() => {
      const timeString = convertTimeToMMSS(interval)
      this.setState({ [`${type}CreditTimer`]: timeString })
      interval = interval - 1000
      if (interval < 1000) {
        setTimeout(() => this._increaseCredit(type), interval)
        clearInterval(timer)
      }
    }, 1000)
  }
  render () {
    const { user, auth } = this.props
    const { pickCreditTimer, battleCreditTimer, adventureCreditTimer } = this.state
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
                  <img src={user ? user.profileImage : DEFAULT_PROFILE_IMAGE_URL} className='mCS_img_loaded' />
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
              {
                auth &&
                <li className='f-700'>
                  <Link to={`/collection/${auth.uid}`}><i className='fa fa-th-large' style={{ fontSize: '22px' }} /> 내 콜렉션</Link>
                </li>
              }
              <li className='f-700'>
                <Link to='/pick-district'>
                  <i className='fa fa-paw' style={{ fontSize: '22px' }} /> 포켓몬 채집
                  {
                    user && (user.pickCredit !== 0 || pickCreditTimer) &&
                    <Badge color={pickCreditTimer ? 'red' : 'lightblue'} text={`${pickCreditTimer || user.pickCredit}`} />
                  }
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-map-o' style={{ fontSize: '22px' }} /> 포켓몬 탐험
                  {
                    user && (user.adventureCredit !== 0 || adventureCreditTimer) &&
                    <Badge color={adventureCreditTimer ? 'red' : 'lightblue'} text={`${adventureCreditTimer || user.adventureCredit}`} />
                  }
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-gamepad' style={{ fontSize: '22px' }} /> 포켓몬 시합
                  {
                    user && (user.battleCredit !== 0 || battleCreditTimer) &&
                    <Badge color={battleCreditTimer ? 'red' : 'lightblue'} text={`${battleCreditTimer || user.battleCredit}`} />
                  }
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-shopping-cart' style={{ fontSize: '22px' }} /> 상점
                  {
                    user && <Badge color='amber' text={`${numeral(1000).format(user.pokemoney || 0)}P`} />
                  }
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
              <li className='f-700'>
                <Link to='/forbidden-area'><i className='fa fa-lock' style={{ fontSize: '22px' }} /> 포켓몬관리</Link>
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
  user: PropTypes.object,
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object
}

const wrappedSidebar = firebaseConnect([
])(Sidebar)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSidebar)

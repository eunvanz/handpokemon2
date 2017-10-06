import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { firebaseConnect, pathToJS } from 'react-redux-firebase'
import $ from 'jquery'
import shallowCompare from 'react-addons-shallow-compare'

import { DEFAULT_PROFILE_IMAGE_URL } from 'constants/urls'
import { PICK_CREDIT_REFRESH, BATTLE_CREDIT_REFRESH, ADVENTURE_CREDIT_REFRESH,
  MAX_PICK_CREDIT, MAX_BATTLE_CREDIT, MAX_ADVENTURE_CREDIT } from 'constants/rules'

import Badge from 'components/Badge'

import { refreshUserCredits } from 'services/UserService'

import { convertTimeToMMSS, getAuthUserFromFirebase } from 'utils/commonUtil'

import { receiveCreditInfo } from 'store/creditInfo'

const mapStateToProps = (state) => {
  return {
    ...getAuthUserFromFirebase(state),
    creditInfo: state.creditInfo
  }
}

const mapDispatchToProps = {
  receiveCreditInfo
}

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this._refreshUserCredits = this._refreshUserCredits.bind(this)
    this._handleCredit = this._handleCredit.bind(this)
    this._increaseCredit = this._increaseCredit.bind(this)
    this.state = {
      pickCreditTimer: null,
      battleCreditTimer: null,
      adventureCreditTimer: null
    }
    this.timeouts = {}
    this.intervals = {}
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentDidUpdate (prevProps, prevState) {
    const { user } = this.props
    const { timeouts } = this
    if (!prevProps.user && user) { // user가 로그인 했을경우 크레딧을 리프레시해서 가져옴
      this._refreshUserCredits()
    } else if (prevProps.user && user) { // 크레딧에 변화가 있을 경우 다시 시간 계산해서 interval 및 timeout 실행
      if (prevProps.user.pickCredit !== user.pickCredit) {
        clearTimeout(timeouts.pick)
        // clearInterval(intervals.pick)
        this._handleCredit(user, 'pick')
      } else if (prevProps.user.battleCredit !== user.battleCredit) {
        clearTimeout(timeouts.battle)
        // clearInterval(intervals.battle)
        this._handleCredit(user, 'battle')
      } else if (prevProps.user.adventureCredit !== user.adventureCredit) {
        clearTimeout(timeouts.adventure)
        // clearInterval(intervals.adventure)
        this._handleCredit(user, 'adventure')
      }
    }
  }
  _refreshUserCredits () {
    const { firebase, auth, user, receiveCreditInfo } = this.props
    refreshUserCredits(firebase, auth.uid, user)
    .then(creditInfo => {
      const { pickCredit, battleCredit, adventureCredit } = creditInfo
      receiveCreditInfo({ pickCredit, battleCredit, adventureCredit })
      this._handleCredit(creditInfo, 'pick')
      this._handleCredit(creditInfo, 'battle')
      this._handleCredit(creditInfo, 'adventure')
    })
  }
  _handleCredit (creditInfo, type) {
    const { pickCredit, lastPick, battleCredit, lastLeague, adventureCredit, lastAdventure } = creditInfo
    const { receiveCreditInfo } = this.props
    const { timeouts } = this
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
      if (credit() === 0) {
        receiveCreditInfo({ [`${type}Credit`]: 0 })
        this._startCreditTimer(type, interval()) // 크레딧이 0인경우 타이머 실행
      } else if (credit() < max()) { // 크레딧이 1부터 max사이인 경우 state에 세팅 후 interval후에 크레딧 증가로직 시작
        receiveCreditInfo({ [`${type}CreditTimer`]: null, [`${type}Credit`]: credit() })
        timeouts[type] = setTimeout(() => this._increaseCredit(type, credit()), interval())
      } else receiveCreditInfo({ [`${type}CreditTimer`]: null, [`${type}Credit`]: credit() }) // 크레딧이 max인 경우는 그냥 세팅
    }
    handleByType(type)
  }
  _increaseCredit (type, asisCredit) { // UI상으로면 크레딧을 업데이트
    const { intervals } = this
    console.log('intervals[type]', intervals[type])
    if (intervals[type]) clearInterval(intervals[type])
    console.log('intervals[type]', intervals[type])
    const { receiveCreditInfo } = this.props
    let interval
    let max
    if (type === 'pick') {
      interval = PICK_CREDIT_REFRESH
      max = MAX_PICK_CREDIT
    } else if (type === 'battle') {
      interval = BATTLE_CREDIT_REFRESH
      max = MAX_BATTLE_CREDIT
    } else {
      interval = ADVENTURE_CREDIT_REFRESH
      max = MAX_ADVENTURE_CREDIT
    }
    let i = 1
    const increaseStateCredit = () => {
      receiveCreditInfo({ [`${type}Credit`]: asisCredit + i })
      i++
    }
    increaseStateCredit()
    if (max > asisCredit + i) {
      intervals[type] = setInterval(() => {
        increaseStateCredit() // 정해진 interval로 1씩 증가시킴
        console.log('intervals[type]', intervals[type])
        console.log('asisCredit', asisCredit)
        console.log('i', i)
        console.log('max', max)
        if (max < asisCredit + i) clearInterval(intervals[type]) // max값에 도달했을 때 timer 중단
      }, interval)
    }
  }
  _startCreditTimer (type, interval) {
    const timer = setInterval(() => {
      const timeString = convertTimeToMMSS(interval)
      this.setState({ [`${type}CreditTimer`]: timeString })
      interval = interval - 1000
      if (interval < 0) {
        setTimeout(() => this._increaseCredit(type, 0), interval) // 1초에서 0초로 바뀔 때 화면의 크레딧을 1로 만듦
        this.setState({ [`${type}CreditTimer`]: null })
        clearInterval(timer)
      }
    }, 1000)
  }
  render () {
    const { user, auth } = this.props
    const { pickCreditTimer, battleCreditTimer, adventureCreditTimer } = this.state
    const { pickCredit, battleCredit, adventureCredit } = this.props.creditInfo
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
                    <i className='fa fa-quote-left c-blue' /> {user.introduce === '' ? '자기소개가 없습니다.' : user.introduce} <i className='fa fa-quote-right c-blue' />
                  </li>
                </ul>
              }
            </div>
            <ul className='main-menu'>
              <li className='f-700'>
                <Link to='/' onClick={() => $('.ma-backdrop').click()}><i className='fa fa-home' style={{ fontSize: '22px' }} /> 홈</Link>
              </li>
              <li className='f-700'>
                <Link to='/'><i className='fa fa-bookmark' style={{ fontSize: '22px' }} /> 업적</Link>
              </li>
              {
                auth &&
                <li className='f-700'>
                  <Link to={`/collection/${auth.uid}`} onClick={() => $('.ma-backdrop').click()}><i className='zmdi zmdi-apps' style={{ fontSize: '22px' }} /> 내 콜렉션</Link>
                </li>
              }
              <li className='f-700'>
                <Link to='/pick-district' onClick={() => $('.ma-backdrop').click()}>
                  <i className='fa fa-paw' style={{ fontSize: '22px' }} /> 포켓몬 채집
                  {
                    user && (pickCredit !== 0 || pickCreditTimer) &&
                    <Badge color={pickCreditTimer ? 'red' : 'lightblue'} text={`${pickCreditTimer || pickCredit}`} />
                  }
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-map-o' style={{ fontSize: '22px' }} /> 포켓몬 탐험
                  {
                    user && (adventureCredit !== 0 || adventureCreditTimer) &&
                    <Badge color={adventureCreditTimer ? 'red' : 'lightblue'} text={`${adventureCreditTimer || adventureCredit}`} />
                  }
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/'>
                  <i className='fa fa-gamepad' style={{ fontSize: '22px' }} /> 포켓몬 시합
                  {
                    user && (battleCredit !== 0 || battleCreditTimer) &&
                    <Badge color={battleCreditTimer ? 'red' : 'lightblue'} text={`${battleCreditTimer || battleCredit}`} />
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
                  <li><Link to='/ranking/collection' onClick={() => $('.ma-backdrop').click()}>콜렉션 랭킹</Link></li>
                  <li><Link to='/ranking/battle' onClick={() => $('.ma-backdrop').click()}>시합 랭킹</Link></li>
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
  auth: PropTypes.object,
  creditInfo: PropTypes.object,
  receiveCreditInfo: PropTypes.func.isRequired
}

const authConnected = connect(({ firebase }) => ({ auth: pathToJS(firebase, 'auth') }))(Sidebar)

const wrappedSidebar = firebaseConnect(({ auth }) =>
  (auth ? [`/userCollections/${auth.uid}`, '/mons'] : null))(authConnected)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSidebar)

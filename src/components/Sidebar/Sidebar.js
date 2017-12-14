import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { firebaseConnect } from 'react-redux-firebase'
import $ from 'jquery'
import shallowCompare from 'react-addons-shallow-compare'
import Visibility from 'visibilityjs'
import { compose } from 'recompose'

import { DEFAULT_PROFILE_IMAGE_URL } from 'constants/urls'
import { PICK_CREDIT_REFRESH, BATTLE_CREDIT_REFRESH, ADVENTURE_CREDIT_REFRESH,
  MAX_PICK_CREDIT, MAX_BATTLE_CREDIT, MAX_ADVENTURE_CREDIT } from 'constants/rules'
import { honors, items } from 'constants/data'

import Badge from 'components/Badge'

import { refreshUserCredits, updateUserIndexes } from 'services/UserService'
import { postHonor } from 'services/HonorService'
import { updateMon } from 'services/MonService'
import { postItem } from 'services/ItemService'

import { convertTimeToMMSS, getAuthUserFromFirebase, getMsg, getThumbnailImageUrl } from 'utils/commonUtil'

import { receiveCreditInfo } from 'store/creditInfo'

import withMons from 'hocs/withMons'
import withAuth from 'hocs/withAuth'

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this._refreshUserCredits = this._refreshUserCredits.bind(this)
    this._handleCredit = this._handleCredit.bind(this)
    this._increaseCredit = this._increaseCredit.bind(this)
    this._handleOnClickPostHonor = this._handleOnClickPostHonor.bind(this)
    this._handleOnClickRestructureMon = this._handleOnClickRestructureMon.bind(this)
    this._initScroll = this._initScroll.bind(this)
    this.state = {
      pickCreditTimer: null,
      battleCreditTimer: null,
      adventureCreditTimer: null,
      hiddenMillis: 0
    }
    this.timeouts = {}
    this.intervals = {} // 크레딧이 0 이상일 경우의 interval
    this.timers = {} // 크레딧이 0일 경우의 interval
  }
  componentDidMount () {
    // 화면이 디스플레이에 다시 노출 시 크레딧 리프레시
    if (this.props.auth) {
      Visibility.change((e, state) => {
        if (state === 'visible') {
          this._refreshUserCredits()
        }
      })
    }
    this._initScroll()
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  _initScroll () {
    // 사이드 바 스크롤 적용
    const $ = window.$
    setTimeout(() => {
      $('#sidebar').mCustomScrollbar({
        theme: 'minimal-dark',
        scrollInertia: 100,
        axis: 'yx',
        mouseWheel: {
          enable: true,
          axis: 'y',
          preventDefault: true
        }
      })
    }, 5000)

    // if ($('#sidebar')) {
    //   $('#sidebar').mCustomScrollbar({
    //     theme: 'minimal-dark',
    //     scrollInertia: 100,
    //     axis: 'yx',
    //     mouseWheel: {
    //       enable: true,
    //       axis: 'y',
    //       preventDefault: true
    //     }
    //   })
    // } else {
    //   setTimeout(() => this(), 5000)
    // }
  }
  componentDidUpdate (prevProps, prevState) {
    const { user } = this.props
    const { timeouts } = this
    if ((!prevProps.user && user) || (prevProps.user && !prevProps.user.nickname && user && user.nickname)) { // user가 로그인 했을경우 크레딧을 리프레시해서 가져옴
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
    if (!auth) return
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
    const { timeouts, timers } = this
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
        this.setState({ [`${type}CreditTimer`]: null })
        if (this.timers[type]) clearInterval(timers[type])

        receiveCreditInfo({ [`${type}CreditTimer`]: null, [`${type}Credit`]: credit() })
        timeouts[type] = setTimeout(() => this._increaseCredit(type, credit()), interval())
      } else {
        this.setState({ [`${type}CreditTimer`]: null })
        if (this.timers[type]) clearInterval(timers[type])
        
        receiveCreditInfo({ [`${type}CreditTimer`]: null, [`${type}Credit`]: credit() }) // 크레딧이 max인 경우는 그냥 세팅
      }
    }
    handleByType(type)
  }
  _increaseCredit (type, asisCredit) { // UI상으로면 크레딧을 업데이트
    const { intervals } = this
    if (intervals[type]) clearInterval(intervals[type])
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
        if (max < asisCredit + i) clearInterval(intervals[type]) // max값에 도달했을 때 timer 중단
      }, interval)
    }
  }
  _startCreditTimer (type, interval) {
    const { timers } = this
    if (this.timers[type]) clearInterval(timers[type])
    this.timers[type] = setInterval(() => {
      const timeString = convertTimeToMMSS(interval)
      this.setState({ [`${type}CreditTimer`]: timeString })
      interval = interval - 1000
      if (interval < 0) {
        setTimeout(() => this._increaseCredit(type, 0), interval) // 1초에서 0초로 바뀔 때 화면의 크레딧을 1로 만듦
        this.setState({ [`${type}CreditTimer`]: null })
        clearInterval(timers[type])
      }
    }, 1000)
  }
  _handleOnClickPostHonor () {
    const { firebase } = this.props
    // const reducer = honors.reduce((prom, honor) => {
    //   return prom.then(() => postHonor(firebase, honor))
    // }, Promise.resolve())
    // reducer()
    const reducer = items.reduce((prom, item) => {
      return prom.then(() => postItem(firebase, item))
    }, Promise.resolve())
    reducer()
  }
  _handleOnClickRestructureMon () {
    const { mons, firebase } = this.props
    mons.forEach(mon => {
      const newMon = Object.assign({}, mon, { name: { ko: mon.name }, description: { ko: mon.description }, skill: { ko: mon.skill } })
      updateMon(firebase, newMon)
      .then(() => {
      })
    })
  }
  render () {
    const { user, auth, messages, locale } = this.props
    const { pickCreditTimer, battleCreditTimer, adventureCreditTimer } = this.state
    const { pickCredit, battleCredit, adventureCredit } = this.props.creditInfo
    const renderCreditBadge = type => {
      let credit
      let creditTimer
      if (type === 'pick') {
        credit = pickCredit
        creditTimer = pickCreditTimer
      } else if (type === 'adventure') {
        credit = adventureCredit
        creditTimer = adventureCreditTimer
      } else if (type === 'battle') {
        credit = battleCredit
        creditTimer = battleCreditTimer
      }
      if (user && credit !== null && (credit !== 0 || creditTimer)) {
        return <Badge color={creditTimer ? 'red' : 'lightblue'} text={`${creditTimer || credit}`} />
      }
    }
    return (
      <aside id='sidebar' className='sidebar c-overflow mCustomScrollbar _mCS_1 mCS-autoHide'
        style={{ overflow: 'visible' }}>
            <div className='s-profile'>
              <a data-ma-action='profile-menu-toggle'>
                <div className='sp-pic'>
                  <img id='sidebarProfileImage' src={user ? (user.profileImageKey ? getThumbnailImageUrl(user.profileImage) : user.profileImage) : DEFAULT_PROFILE_IMAGE_URL} className='mCS_img_loaded' />
                </div>
                <div className='sp-info' style={{ marginTop: '18px' }}>
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
                <Link to='/' onClick={() => $('.ma-backdrop').click()}><i><i className='fa fa-home' style={{ fontSize: '18px' }} /></i> {getMsg(messages.sidebar.home, locale)}</Link>
              </li>
              {
                auth &&
                <li className='f-700'>
                  <Link to='/honor' onClick={() => $('.ma-backdrop').click()}><i><i className='fa fa-bookmark' style={{ fontSize: '18px' }} /></i> {getMsg(messages.sidebar.achievements, locale)}</Link>
                </li>
              }
              {
                auth &&
                <li className='f-700'>
                  <Link to={`/collection/${auth.uid}`} onClick={() => $('.ma-backdrop').click()}><i><i className='fa fa-th' style={{ fontSize: '18px' }} /></i> {getMsg(messages.sidebar.collections, locale)}</Link>
                </li>
              }
              {
                auth &&
                <li className='f-700'>
                  <Link to='/giftbox' onClick={() => $('.ma-backdrop').click()}>
                    <i><i className='fa fa-gift' style={{ fontSize: '18px' }} /></i> 내 선물함
                    {user.inventory && user.inventory.length > 0 && <Badge color='lightblue' text={String(user.inventory.length)} />}
                  </Link>
                </li>
              }
              <li className='f-700'>
                <Link to='/pick-district' onClick={() => $('.ma-backdrop').click()}>
                  <i><i className='fa fa-paw' style={{ fontSize: '18px' }} /></i> 포켓몬 채집
                  {renderCreditBadge('pick')}
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/adventure' onClick={() => $('.ma-backdrop').click()}>
                  <i><i className='fa fa-compass' style={{ fontSize: '18px' }} /></i> 포켓몬 탐험
                  {renderCreditBadge('adventure')}
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/battle' onClick={() => $('.ma-backdrop').click()}>
                  <i><i className='fa fa-gamepad' style={{ fontSize: '18px' }} /></i> 포켓몬 시합
                  {renderCreditBadge('battle')}
                </Link>
              </li>
              <li className='f-700'>
                <Link to='/item-shop' onClick={() => $('.ma-backdrop').click()}>
                  <i><i className='fa fa-shopping-cart' style={{ fontSize: '18px' }} /></i> 상점
                  {
                    user && <Badge color='amber' text={`${numeral(user.pokemoney || 0).format('0,0')}P`} />
                  }
                </Link>
              </li>
              <li className='sub-menu f-700'>
                <a style={{ cursor: 'pointer' }}
                  data-ma-action='submenu-toggle'><i><i className='fa fa-trophy-alt' style={{ fontSize: '18px' }} /></i> 랭킹</a>
                <ul style={{ display: 'none' }}>
                  <li><Link to='/ranking/collection' onClick={() => $('.ma-backdrop').click()}>콜렉션 랭킹</Link></li>
                  <li><Link to='/ranking/battle' onClick={() => $('.ma-backdrop').click()}>시합 랭킹</Link></li>
                </ul>
              </li>
              <li className='sub-menu f-700'>
                <a style={{ cursor: 'pointer' }}
                  data-ma-action='submenu-toggle'><i><i className='fa fa-comments' style={{ fontSize: '18px' }} /></i> 커뮤니티</a>
                <ul style={{ display: 'none' }}>
                  <li><Link to='/board-list/notice/all' onClick={() => $('.ma-backdrop').click()}>공지사항</Link></li>
                  <li><Link to='/board-list/free/all' onClick={() => $('.ma-backdrop').click()}>게시판</Link></li>
                  <li><Link to='/board-list/guide/all' onClick={() => $('.ma-backdrop').click()}>게임가이드</Link></li>
                </ul>
              </li>
              <li className='f-700'>
                <Link to='/workshop' onClick={() => $('.ma-backdrop').click()}>
                  <i><i className='fa fa-paint-brush' style={{ fontSize: '18px' }} /></i> 포켓몬 공작소
                </Link>
              </li>
              {
                user && user.authorization === 'admin' &&
                <div>
                  <li className='f-700'>
                    <Link to='/forbidden-area'><i><i className='fa fa-lock' style={{ fontSize: '18px' }} /></i> 포켓몬관리</Link>
                  </li>
                  <li className='f-700'>
                    <Link to='/stage-management'><i><i className='fa fa-lock' style={{ fontSize: '18px' }} /></i> 스테이지관리</Link>
                  </li>
                </div>
              }
              {/* <li className='f-700'>
                <a onClick={() => updateUserIndexes(this.props.firebase)}><i className='fa fa-lock' style={{ fontSize: '18px' }} /> 일회용</a>
                </li> */}
              {/* <li className='f-700'>
                <a onClick={this._handleOnClickPostHonor}><i className='fa fa-lock' style={{ fontSize: '18px' }} /> 아이템생성</a>
              </li> */}
              {/* <li className='f-700'>
                <a onClick={this._handleOnClickRestructureMon}><i className='fa fa-lock' style={{ fontSize: '18px' }} /> 몬구조변환</a>
              </li> */}
            </ul>
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
  receiveCreditInfo: PropTypes.func.isRequired,
  messages: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  mons: PropTypes.array
}

// const authConnected = connect(({ firebase }) => ({ auth: pathToJS(firebase, 'auth') }))(Sidebar)

// const wrappedSidebar = firebaseConnect(({ auth }) =>
//   (auth ? [`/userCollections/${auth.uid}`, '/mons'] : null))(authConnected)

const mapStateToProps = (state) => {
  return {
    creditInfo: state.creditInfo
  }
}

const mapDispatchToProps = {
  receiveCreditInfo
}

// const wrappedSidebar = connect(({ firebase }) => ({ auth: pathToJS(firebase, 'auth') }))(Sidebar)

const wrappedSidebar = compose(firebaseConnect(), withAuth(false), withMons)(Sidebar)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedSidebar)

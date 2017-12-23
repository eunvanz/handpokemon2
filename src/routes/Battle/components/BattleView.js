import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'
import { toast } from 'react-toastify'

import BattleReady from './BattleReady'
import ChooseEnemy from './ChooseEnemy'
import ChoosePick from './ChoosePick'
import ChooseFirstAttack from './ChooseFirstAttack'
import BattleStage from './BattleStage'
import BattleResult from './BattleResult'
import LoadingContainer from 'components/LoadingContainer'

import Battle from 'bizs/Battle'
import Pick from 'bizs/Pick'

import { setUserPath, updateUserToLose, decreaseCredit, updateUserToWin,
  getUserRankingByUserId, getAllUser } from 'services/UserService'
import { updateIsDefender, setDefendersToMaxCostByUserId } from 'services/CollectionService'

import { getMsg, getLeague } from 'utils/commonUtil'

import User from 'models/user'

import doctorOh from '../../Adventure/components/assets/doctor_oh.png'
import woongImg from '../../../components/TutorialModal/assets/KakaoTalk_2017-12-21-11-30-42_Photo_14.png'

class BattleView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isAdventure: props.location.query.type && props.location.query.type === 'adventure',
      step: props.location.query.type === 'adventure' ? 2 : 1,
      chosenEnemy: null,
      winInRow: props.user.winInRow || 0,
      battleResultInfo: null,
      isDefenseMode: false
    }
    this._handleOnClickStartBattle = this._handleOnClickStartBattle.bind(this)
    this._handleOnClickChooseEnemy = this._handleOnClickChooseEnemy.bind(this)
    this._handleOnClickPickNext = this._handleOnClickPickNext.bind(this)
    this._onSlowdownFirstAttackRouletteCallback = this._onSlowdownFirstAttackRouletteCallback.bind(this)
    this._handleOnClickReady = this._handleOnClickReady.bind(this)
    this._handleOnClickCompleteBattle = this._handleOnClickCompleteBattle.bind(this)
    this._handleOnClickContinueBattle = this._handleOnClickContinueBattle.bind(this)
    this._generateBattleResult = this._generateBattleResult.bind(this)
    this._getTrainerForAdventure = this._getTrainerForAdventure.bind(this)
    this._getStage = this._getStage.bind(this)
    this._handleOnClickDefense = this._handleOnClickDefense.bind(this)
    this._handleOnClickApplyDefender = this._handleOnClickApplyDefender.bind(this)
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.location.query.type !== this.props.location.query.type) {
      this.setState({
        isAdventure: this.props.location.query.type && this.props.location.query.type === 'adventure',
        step: this.props.location.query.type === 'adventure' ? 2 : 1
      })
    }
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    const { clearBattle } = this.props
    clearBattle()
  }
  _handleOnClickReady () {
    const { user } = this.props
    this.setState({ step: 2, chosenEnemy: null, winInRow: user.winInRow, battleResultInfo: null })
  }
  _handleOnClickDefense () {
    this.setState({ step: 2, isDefenseMode: true })
  }
  _handleOnClickPickNext (userPick) {
    const { isAdventure } = this.state
    const { setUserPicks, firebase, auth, fetchCandidates, messages, locale, user, setEnemyPicks } = this.props
    return decreaseCredit(firebase, auth.uid, 1, isAdventure ? 'adventure' : 'battle')
    .then(() => {
      return !isAdventure ? updateUserToLose(firebase, auth.uid, 'attackLose', 5) : Promise.resolve()
    })
    .then(() => {
      return !isAdventure ? fetchCandidates(firebase, user.league, auth.uid) : Promise.resolve()
    })
    .then(() => {
      setUserPicks(userPick)
      let state
      if (isAdventure) {
        setEnemyPicks(this._getEnemyPicksForAdventure())
        state = {
          step: 4,
          chosenEnemy: this._getTrainerForAdventure()
        }
      } else {
        state = {
          step: 3
        }
      }
      this.setState(state)
      return Promise.resolve()
    })
    .catch(msg => {
      window.swal({ text: `${getMsg(messages.common.fail, locale)} - ${msg}` })
      return Promise.reject(msg)
    })
  }
  _handleOnClickApplyDefender (defenders) { // defenders.asis, defenders.tobe
    // TODO: 총 전투력 제한 및 코스트 체크로직 들어가야함
    const { firebase } = this.props
    const asisProms = []
    const tobeProms = []
    defenders.asis.forEach(defender => {
      tobeProms.push(updateIsDefender(firebase, defender, false))
    })
    defenders.tobe.forEach(defender => {
      tobeProms.push(updateIsDefender(firebase, defender, true))
    })
    return Promise.all(asisProms)
      .then(() => {
        return Promise.all(tobeProms)
      })
      .then(() => {
        toast('새로운 수비 포켓몬이 적용되었습니다.')
        return Promise.resolve()
      })
  }
  _getTrainerForAdventure () { // 탐험모드일때 사용
    const { user, messages, locale } = this.props
    if ((user.stage || 1) <= 40) {
      return Object.assign({}, new User(), { nickname: getMsg(messages.adventure.trainerName[0], locale), profileImage: doctorOh })
    } else if (user.stage <= 80) {
      return Object.assign({}, new User(), { nickname: getMsg(messages.adventure.trainerName[1], locale), profileImage: woongImg, enabledHonors: [{ burf: [5, 5, 5, 5, 5, 5], name: '특급트레이너', type: 1, id: '-L-MK6QhWji8QtK0kQ8Y', reward: 50, condition: 100 }] })
    }
  }
  _getEnemyPicksForAdventure () {
    return this._getStage().picks
  }
  _getStage () {
    const { stages, user } = this.props
    const stage = stages[stages.length - (user.stage || 1)]
    return stage
  }
  _handleOnClickChooseEnemy (idx) {
    const { candidates, setEnemyPicks } = this.props
    const choosenCandidate = candidates[idx]
    setEnemyPicks(choosenCandidate.defenders)
    this.setState({
      chosenEnemy: choosenCandidate.user,
      step: 4
    })
  }
  _onSlowdownFirstAttackRouletteCallback (stopIdx) {
    const { userPicks, enemyPicks, user, setBattleLog } = this.props
    const { chosenEnemy } = this.state
    let firstAttacker = 'enemy'
    if (stopIdx === 0) firstAttacker = 'user'
    const userPicksToSet = userPicks.map(pick => new Pick(pick, user))
    const enemyPicksToSet = enemyPicks.map(pick => new Pick(pick, chosenEnemy))
    const battle = new Battle(userPicksToSet, enemyPicksToSet, firstAttacker)
    const log = battle._generateBattleLog()
    setBattleLog(log)
  }
  _handleOnClickStartBattle () {
    this.setState({ step: 5 })
  }
  _handleOnClickCompleteBattle (speed) {
    const { auth, firebase } = this.props
    const { isAdventure } = this.state
    setUserPath(firebase, auth.uid, 'battleSpeed', speed)
    this.setState({ step: 6 })
    console.log('isAdventure', isAdventure)
    if (!isAdventure) this._generateBattleResult()
  }
  _handleOnClickContinueBattle () {
    this.setState({ step: 1, chosenEnemy: null })
  }
  _generateBattleResult () {
    console.log('generateBattleResult')
    const { auth, firebase, battleLog, user } = this.props
    const { chosenEnemy, winInRow } = this.state
    const battleResultInfo = {
      asisUser: {
        leaguePoint: user.leaguePoint + 5,
        leagueRank: user.leagueRank
      },
      asisEnemy: {
        leaguePoint: chosenEnemy.leaguePoint,
        leagueRank: chosenEnemy.leagueRank
      }
    }
    let tobeResultInfo = { tobeUser: {}, tobeEnemy: {} }
    Promise.resolve()
    .then(() => {
      const winner = battleLog.winner
      let userWinPoint = 10
      let enemyWinPoint = 2
      if (battleLog.mom.user.email === user.email) userWinPoint += 1
      else enemyWinPoint += 1
      if (winner === 'user') {
        tobeResultInfo.tobeUser.leaguePoint = user.leaguePoint + userWinPoint
        return updateUserToWin(firebase, auth.uid, 'attackWin', userWinPoint, winInRow)
        .then(() => {
          tobeResultInfo.tobeEnemy.leaguePoint = chosenEnemy.leaguePoint - 2
          return updateUserToLose(firebase, chosenEnemy.id, 'defenseLose', 2)
        })
      } else {
        tobeResultInfo.tobeEnemy.leaguePoint = chosenEnemy.leaguePoint + enemyWinPoint
        tobeResultInfo.tobeUser.leaguePoint = user.leaguePoint
        return updateUserToWin(firebase, chosenEnemy.id, 'defenseWin', enemyWinPoint)
      }
    })
    .then(() => {
      return getUserRankingByUserId(firebase, 'battle', auth.uid)
    })
    .then(rank => {
      tobeResultInfo.tobeUser.leagueRank = rank
      return getUserRankingByUserId(firebase, 'battle', chosenEnemy.id)
    })
    .then(rank => {
      tobeResultInfo.tobeEnemy.leagueRank = rank
      const lastBattleResultInfo = Object.assign({}, battleResultInfo, tobeResultInfo)
      this.setState({ battleResultInfo: lastBattleResultInfo })
      return getAllUser(firebase)
    })
    .then(userArr => {
      // user들의 리그를 다시 계산
      const allUserNum = userArr.length
      const userLeague = getLeague(tobeResultInfo.tobeUser.leagueRank, allUserNum)
      const enemyLeague = getLeague(tobeResultInfo.tobeEnemy.leagueRank, allUserNum)
      let setLeagueArr = []
      if (userLeague !== user.league) setLeagueArr.push(setUserPath(firebase, auth.uid, 'league', userLeague))
      if (enemyLeague !== chosenEnemy.league) setLeagueArr.push(setUserPath(firebase, chosenEnemy.id, 'league', enemyLeague))
      let updateLeaguePromise = setLeagueArr.length > 0 ? () => Promise.all(setLeagueArr) : () => Promise.resolve()
      return updateLeaguePromise()
      .then(() => {
        // user들이 하위리그 또는 상위로 변경됐을 경우 수비 포켓몬을 다시 지정
        let setDefendersArr = []
        if (userLeague !== user.league) setDefendersArr.push(setDefendersToMaxCostByUserId(firebase, auth.uid))
        if (enemyLeague !== chosenEnemy.league) setDefendersArr.push(setDefendersToMaxCostByUserId(firebase, chosenEnemy.id))
        return setDefendersArr.length > 0 ? Promise.all(setDefendersArr) : Promise.resolve()
      })
    })
    .catch(err => {
      window.swal({ text: `에러가 발생했습니다. - ${err}` })
    })
  }
  render () {
    const { step, chosenEnemy, winInRow, battleResultInfo, isAdventure, isDefenseMode } = this.state
    const { user, candidates, userCollections, battleLog, userPicks, enemyPicks, auth, creditInfo, locale, items, firebase, messages, setTutorialModal } = this.props
    const renderBody = () => {
      if (step === 1) {
        return (
          <BattleReady auth={auth} onClickStart={this._handleOnClickReady} creditInfo={creditInfo} onClickDefense={this._handleOnClickDefense} />
        )
      } else if (step === 2) {
        if (!userCollections) return <LoadingContainer text='콜렉션을 불러오는 중...' />
        return (
          <ChoosePick isDefenseMode={isDefenseMode} setTutorialModal={setTutorialModal} collections={userCollections} onClickNext={this._handleOnClickPickNext} user={user} locale={locale} messages={messages} isAdventure={isAdventure} maxCost={isAdventure ? this._getStage().maxCost : null} onClickApplyDefender={this._handleOnClickApplyDefender} />
        )
      } else if (step === 3) {
        return (
          <ChooseEnemy candidates={candidates} userPicks={userPicks} onClickChoose={this._handleOnClickChooseEnemy} locale={locale} messages={messages} />
        )
      } else if (step === 4) {
        return (
          <ChooseFirstAttack user={user} setTutorialModal={setTutorialModal} onSlowdownCallback={this._onSlowdownFirstAttackRouletteCallback} onClickStart={this._handleOnClickStartBattle} />
        )
      } else if (step === 5) {
        return (
          <BattleStage setTutorialModal={setTutorialModal} battleLog={battleLog} userPicks={userPicks} user={user} enemy={chosenEnemy} enemyPicks={enemyPicks} locale={locale} messages={messages} onClickNext={this._handleOnClickCompleteBattle} />
        )
      } else if (step === 6) {
        return (
          <BattleResult setTutorialModal={setTutorialModal} user={user} winInRow={winInRow} enemy={chosenEnemy} auth={auth} locale={locale} items={items} firebase={firebase} stage={isAdventure ? this._getStage() : null}
            battleLog={battleLog} onClickContinue={this._handleOnClickContinueBattle} battleResultInfo={battleResultInfo} isAdventure={isAdventure} messages={messages} />
          // <BattleResult user={user} winInRow={winInRow} enemy={chosenEnemy} onMount={this._handleOnMountBattleResultView}
          //   battleLog={battleLog} onClickContinue={this._handleOnClickContinueBattle} />
        )
      }
    }
    return renderBody()
  }
}

BattleView.contextTypes = {
  router: PropTypes.object.isRequired
}

BattleView.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object,
  user: PropTypes.object,
  fetchCandidates: PropTypes.func.isRequired,
  setEnemyPicks: PropTypes.func.isRequired,
  setUserPicks: PropTypes.func.isRequired,
  setBattleLog: PropTypes.func.isRequired,
  candidates: PropTypes.array,
  enemyPicks: PropTypes.array,
  userPicks: PropTypes.array,
  battleLog: PropTypes.object,
  clearBattle: PropTypes.func.isRequired,
  userCollections: PropTypes.array.isRequired,
  creditInfo: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  messages: PropTypes.object.isRequired,
  location: PropTypes.object,
  stages: PropTypes.array.isRequired,
  setTutorialModal: PropTypes.func.isRequired
}

export default BattleView

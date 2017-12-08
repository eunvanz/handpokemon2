import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import BattleReady from './BattleReady'
import ChooseEnemy from './ChooseEnemy'
import ChoosePick from './ChoosePick'
import ChooseFirstAttack from './ChooseFirstAttack'
import BattleStage from './BattleStage'
import BattleResult from './BattleResult'

import Battle from 'bizs/Battle'
import Pick from 'bizs/Pick'

import { setUserPath, updateUserToLose, decreaseCredit, updateUserToWin,
  getUserRankingByUserId } from 'services/UserService'

class BattleView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      chosenEnemy: null,
      winInRow: props.user.winInRow || 0,
      battleResultInfo: null
    }
    this._handleOnClickStartBattle = this._handleOnClickStartBattle.bind(this)
    this._handleOnClickChooseEnemy = this._handleOnClickChooseEnemy.bind(this)
    this._handleOnClickPickNext = this._handleOnClickPickNext.bind(this)
    this._onSlowdownFirstAttackRouletteCallback = this._onSlowdownFirstAttackRouletteCallback.bind(this)
    this._handleOnClickReady = this._handleOnClickReady.bind(this)
    this._handleOnClickCompleteBattle = this._handleOnClickCompleteBattle.bind(this)
    this._handleOnClickContinueBattle = this._handleOnClickContinueBattle.bind(this)
    this._generateBattleResult = this._generateBattleResult.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    const { clearBattle } = this.props
    clearBattle()
  }
  _handleOnClickReady () {
    const { fetchCandidates, auth, user, firebase } = this.props
    // 유저의 패배를 기록
    decreaseCredit(firebase, auth.uid, 1, 'battle')
    .then(() => {
      this.setState({ step: 2, chosenEnemy: null, winInRow: user.winInRow, battleResultInfo: null })
      return updateUserToLose(firebase, auth.uid, 'attackLose', 5)
    })
    .then(() => {
      return fetchCandidates(firebase, user.league)
    })
    .catch(err => {
      return window.swal({ text: '에러가 발생했습니다. - ' + err })
    })
  }
  _handleOnClickPickNext (userPick) {
    const { setUserPicks } = this.props
    setUserPicks(userPick)
    this.setState({ step: 3 })
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
    setUserPath(firebase, auth.uid, 'battleSpeed', speed)
    this.setState({ step: 6 })
    this._generateBattleResult()
  }
  _handleOnClickContinueBattle () {
    this.setState({ step: 1, chosenEnemy: null })
  }
  _generateBattleResult () {
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
    })
    // .catch(err => {
    //   window.swal({ text: `에러가 발생했습니다. - ${err}` })
    // })
  }
  render () {
    const { step, chosenEnemy, winInRow, battleResultInfo } = this.state
    const { user, candidates, userCollections, battleLog, userPicks, enemyPicks, auth, creditInfo, locale, items, firebase, messages } = this.props
    const renderBody = () => {
      if (step === 1) {
        return (
          <BattleReady auth={auth} onClickStart={this._handleOnClickReady} creditInfo={creditInfo} />
        )
      } else if (step === 2) {
        return (
          <ChoosePick collections={userCollections} onClickNext={this._handleOnClickPickNext} user={user} locale={locale} messages={messages} />
        )
      } else if (step === 3) {
        return (
          <ChooseEnemy candidates={candidates} userPicks={userPicks} onClickChoose={this._handleOnClickChooseEnemy} locale={locale} messages={messages} />
        )
      } else if (step === 4) {
        return (
          <ChooseFirstAttack onSlowdownCallback={this._onSlowdownFirstAttackRouletteCallback} onClickStart={this._handleOnClickStartBattle} />
        )
      } else if (step === 5) {
        return (
          <BattleStage battleLog={battleLog} userPicks={userPicks} user={user} enemy={chosenEnemy} enemyPicks={enemyPicks} locale={locale} onClickNext={this._handleOnClickCompleteBattle} />
        )
      } else if (step === 6) {
        return (
          <BattleResult user={user} winInRow={winInRow} enemy={chosenEnemy} auth={auth} locale={locale} items={items} firebase={firebase}
            battleLog={battleLog} onClickContinue={this._handleOnClickContinueBattle} battleResultInfo={battleResultInfo} />
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
  messages: PropTypes.object.isRequired
}

export default BattleView

import React from 'react'
import PropTypes from 'prop-types'
import shallowCompare from 'react-addons-shallow-compare'

import ContentContainer from 'components/ContentContainer'
import Button from 'components/Button'
import CenterMidContainer from 'components/CenterMidContainer'
import Loading from 'components/Loading'
import BattleReady from './BattleReady'
import ChooseEnemy from './ChooseEnemy'
import ChoosePick from './ChoosePick'
import ChooseFirstAttack from './ChooseFirstAttack'
import BattleStage from './BattleStage'

import Battle from 'bizs/Battle'
import Pick from 'bizs/Pick'

class BattleView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      chosenEnemy: null
    }
    this._handleOnClickStartBattle = this._handleOnClickStartBattle.bind(this)
    this._handleOnClickChooseEnemy = this._handleOnClickChooseEnemy.bind(this)
    this._handleOnClickPickNext = this._handleOnClickPickNext.bind(this)
    this._onStopRouletteCallback = this._onStopRouletteCallback.bind(this)
    this._handleOnClickReady = this._handleOnClickReady.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillUnmount () {
    const { clearBattle } = this.props
    clearBattle()
  }
  _handleOnClickReady () {
    const { fetchCandidates, user, firebase } = this.props
    this.setState({ step: 2 })
    fetchCandidates(firebase, user.league)
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
    this.setState({ chosenEnemy: choosenCandidate.user, step: 4 })
  }
  _onStopRouletteCallback (stopIdx) {
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
  render () {
    const { step, chosenEnemy } = this.state
    const { user, candidates, userCollections, battleLog, userPicks, enemyPicks } = this.props
    const renderBody = () => {
      if (step === 1) {
        return (
          <BattleReady user={user} onClickStart={this._handleOnClickReady} />
        )
      } else if (step === 2) {
        return (
          <ChoosePick collections={userCollections} onClickNext={this._handleOnClickPickNext} user={user} />
        )
      } else if (step === 3) {
        return (
          <ChooseEnemy candidates={candidates} onClickChoose={this._handleOnClickChooseEnemy} />
        )
      } else if (step === 4) {
        return (
          <ChooseFirstAttack onStopCallback={this._onStopRouletteCallback} onClickStart={this._handleOnClickStartBattle} />
        )
      } else if (step === 5) {
        return (
          <BattleStage battleLog={battleLog} userPicks={userPicks} user={user} enemy={chosenEnemy} enemyPicks={enemyPicks} />
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
  userCollections: PropTypes.array.isRequired
}

export default BattleView

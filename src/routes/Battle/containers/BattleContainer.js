import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { compose } from 'recompose'

import BattleView from '../components/BattleView'

import withAuth from 'hocs/withAuth'

import { fetchCandidates, setEnemyPicks, setUserPicks, setBattleLog, clearBattle } from '../modules/battle'

const mapDispatchToProps = dispatch => {
  return {
    fetchCandidates: (firebase, league) => dispatch(fetchCandidates(firebase, league)),
    setEnemyPicks: (enemyPick) => dispatch(setEnemyPicks(enemyPick)),
    setUserPicks: (userPick) => dispatch(setUserPicks(userPick)),
    setBattleLog: (battleLog) => dispatch(setBattleLog(battleLog)),
    clearBattle: () => dispatch(clearBattle())
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.battle
  }
}

const wrappedBattleView = compose(firebaseConnect(), withAuth(true))(BattleView)

export default connect(mapStateToProps, mapDispatchToProps)(wrappedBattleView)

import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import BattleView from '../components/BattleView'

import { getAuthUserFromFirebase } from 'utils/commonUtil'

import needAuth from 'hocs/needAuth'

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
    ...getAuthUserFromFirebase(state),
    ...state.battle
  }
}

const wrappedBattleView = firebaseConnect([
])(needAuth(BattleView))

export default connect(mapStateToProps, mapDispatchToProps)(wrappedBattleView)

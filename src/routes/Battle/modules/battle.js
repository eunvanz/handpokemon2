import { getUsersByLeagueForBattle } from 'services/UserService'
import { getCollectionsByUserId } from 'services/CollectionService'

import _ from 'lodash'

import { convertMapToArr } from 'utils/commonUtil'

const initialState = {
  candidates: null,
  enemyPicks: null,
  userPicks: null,
  battleLog: null
}

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_CANDIDATES = 'RECEIVE_CANDIDATES'
export const RECEIVE_ENEMY_PICKS = 'RECEIVE_ENEMY_PICKS'
export const RECEIVE_USER_PICKS = 'RECEIVE_USER_PICKS'
export const RECEIVE_BATTLE_LOG = 'RECEIVE_BATTLE_LOG'
export const RECEIVE_BATTLE = 'RECEIVE_BATTLE'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveCandiates (candidates = null) {
  return {
    type: RECEIVE_CANDIDATES,
    payload: candidates
  }
}

export function receiveEnemyPicks (enemyPicks = null) {
  return {
    type: RECEIVE_ENEMY_PICKS,
    payload: enemyPicks
  }
}

export function receiveUserPicks (userPicks = null) {
  return {
    type: RECEIVE_USER_PICKS,
    payload: userPicks
  }
}

export function receiveBattleLog (battleLog = null) {
  return {
    type: RECEIVE_BATTLE_LOG,
    payload: battleLog
  }
}

export function receiveBattle (battle = initialState) {
  return {
    type: RECEIVE_BATTLE,
    payload: battle
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const fetchCandidates = (firebase, league, userId) => {
  return dispatch => {
    return getUsersByLeagueForBattle(firebase, league, userId)
    .then(users => {
      const userArr = convertMapToArr(users)
      const result = []
      const promArr = []
      const getRandomIds = () => {
        const ids = []
        while (ids.length < 3) {
          const id = userArr[_.random(0, userArr.length - 1)].id
          if (ids.indexOf(id) === -1) ids.push(id)
        }
        return ids
      }
      const userIds = getRandomIds()
      for (let i = 0; i < 3; i++) {
        promArr.push(getCollectionsByUserId(firebase, userIds[i]))
      }
      return Promise.all(promArr)
      .then(userCollectionsArr => {
        userCollectionsArr.forEach(userCollections => {
          const defenders = userCollections.filter(col => col.isDefender)
          const candidateDefenders = Object.assign({}, { defenders }, { user: users[defenders[0].userId] })
          result.push(candidateDefenders)
        })
        return dispatch(receiveCandiates(result))
      })
      .catch(() => {
        return dispatch(fetchCandidates(firebase, league))
      })
    })
  }
}

export const clearBattle = () => {
  return dispatch => {
    return dispatch(receiveBattle(initialState))
  }
}

export const setEnemyPicks = enemyPicks => {
  return dispatch => {
    return dispatch(receiveEnemyPicks(enemyPicks))
  }
}

export const setUserPicks = userPicks => {
  return dispatch => {
    return dispatch(receiveUserPicks(userPicks))
  }
}

export const setBattleLog = battleLog => {
  return dispatch => {
    return dispatch(receiveBattleLog(battleLog))
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function battleReducer (state = initialState, action = { type: null }) {
  switch (action.type) {
    case RECEIVE_CANDIDATES:
      return Object.assign({}, state, { candidates: action.payload })
    case RECEIVE_ENEMY_PICKS:
      return Object.assign({}, state, { enemyPicks: action.payload })
    case RECEIVE_USER_PICKS:
      return Object.assign({}, state, { userPicks: action.payload })
    case RECEIVE_BATTLE_LOG:
      return Object.assign({}, state, { battleLog: action.payload })
    case RECEIVE_BATTLE:
      return action.payload
    default:
      return state
  }
}

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_FILTER = 'RECEIVE_FILTER'

const initialState = {
  has: {
    yes: true,
    no: true
  },
  grade: {
    b: true,
    r: true,
    s: true,
    sr: true,
    e: true,
    l: true
  },
  mainAttr: {
    '노말': true,
    '불꽃': true,
    '물': true,
    '전기': true,
    '풀': true,
    '얼음': true,
    '비행': true,
    '요정': true,
    '땅': true,
    '독': true,
    '격투': true,
    '염력': true,
    '벌레': true,
    '바위': true,
    '유령': true,
    '용': true,
    '악': true,
    '강철': true
  },
  subAttr: {
    '노말': true,
    '불꽃': true,
    '물': true,
    '전기': true,
    '풀': true,
    '얼음': true,
    '비행': true,
    '요정': true,
    '땅': true,
    '독': true,
    '격투': true,
    '염력': true,
    '벌레': true,
    '바위': true,
    '유령': true,
    '용': true,
    '악': true,
    '강철': true,
    '없음': true
  },
  cost: {
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
    '8': true,
    '9': true,
    '10': true
  },
  generation: {
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true
  },
  isEvolutable: {
    yes: true,
    no: true
  }
}
// ------------------------------------
// Actions
// ------------------------------------
export function receiveFilter (filter = null) {
  return {
    type: RECEIVE_FILTER,
    payload: filter
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function filterReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_FILTER:
      return action.payload
    default:
      return state
  }
}

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_HONOR_INFO = 'RECEIVE_HONOR_INFO'

const initialState = {
  show: false,
  messages: null,
  honors: null
}
// ------------------------------------
// Actions
// ------------------------------------
export function showHonorModal (honorInfo = null) {
  return {
    type: RECEIVE_HONOR_INFO,
    payload: Object.assign({}, honorInfo, { show: true })
  }
}

export function hideHonorModal (honorInfo = null) {
  return {
    type: RECEIVE_HONOR_INFO,
    payload: Object.assign({}, honorInfo, { show: false })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function honorModalReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_HONOR_INFO:
      return action.payload
    default:
      return state
  }
}

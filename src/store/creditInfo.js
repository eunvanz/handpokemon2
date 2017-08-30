// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_CREDIT_INFO = 'RECEIVE_CREDIT_INFO'

const initialState = {
  pickCredit: null,
  battleCredit: null,
  adventureCredit: null
}

// ------------------------------------
// Actions
// ------------------------------------
export function receiveCreditInfo (creditInfo = initialState) {
  return {
    type: RECEIVE_CREDIT_INFO,
    payload: creditInfo
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function (state = initialState, action) {
  return action.type === RECEIVE_CREDIT_INFO
    ? Object.assign({}, state, action.payload)
    : state
}

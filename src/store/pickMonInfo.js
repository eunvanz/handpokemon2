// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_PICK_MON_INFO = 'RECEIVE_PICK_MON_INFO'

// ------------------------------------
// Actions
// ------------------------------------
export function receivePickMonInfo (pickMonInfo = null) {
  return {
    type    : RECEIVE_PICK_MON_INFO,
    payload : pickMonInfo
  }
}

export function clearPickMonInfo (pickMonInfo = null) {
  return {
    type    : RECEIVE_PICK_MON_INFO,
    payload : null
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
// const stateSample = {
//   quantity: 1,
//   attrs: ['불꽃', '물', '요정'],
//   grades: ['b', 'r'],
//   evoluteNo: null
// }
const initialState = null
export default function pickMonInfoReducer (state = initialState, action) {
  return action.type === RECEIVE_PICK_MON_INFO
    ? action.payload
    : state
}

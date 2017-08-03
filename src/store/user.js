import { getUserById } from 'services/UserService'

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_USER = 'RECEIVE_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function receiveUser (user = null) {
  return {
    type    : RECEIVE_USER,
    payload : user
  }
}

export function clearUser (user = null) {
  return {
    type    : RECEIVE_USER,
    payload : null
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const fetchUserById = id => {
  return dispatch => {
    return getUserById(id)
    .then(user => {
      return dispatch(receiveUser(user))
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function userReducer (state = initialState, action) {
  return action.type === RECEIVE_USER
    ? action.payload
    : state
}

import { getUserById } from 'services/UserService'

// ------------------------------------
// Constants
// ------------------------------------
export const SET_USER = 'SET_USER'

// ------------------------------------
// Actions
// ------------------------------------
export function setUser (user = null) {
  return {
    type    : SET_USER,
    payload : user
  }
}

export function clearUser (user = null) {
  return {
    type    : SET_USER,
    payload : null
  }
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const setUserById = id => {
  return dispatch => {
    return getUserById(id)
    .then(user => {
      return dispatch(setUser(user))
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null
export default function userReducer (state = initialState, action) {
  return action.type === SET_USER
    ? action.payload
    : state
}

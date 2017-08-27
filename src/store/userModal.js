// ------------------------------------
// Constants
// ------------------------------------
export const SET_USER_MODAL = 'SET_USER_MODAL'
export const CLOSE_USER_MODAL = 'CLOSE_USER_MODAL'

const initialState = {
  show: false,
  user: null,
  isMyself: false,
  isLoading: true
}
// ------------------------------------
// Actions
// ------------------------------------
export function setUserModal (userModal = initialState) {
  return {
    type: SET_USER_MODAL,
    payload: Object.assign({}, initialState, userModal)
  }
}

export function showUserModal (userModal = initialState) {
  return {
    type: SET_USER_MODAL,
    payload: Object.assign({}, initialState, userModal, { show: true })
  }
}

export function closeUserModal () {
  return {
    type: CLOSE_USER_MODAL
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function userModalReducer (state = initialState, action) {
  switch (action.type) {
    case SET_USER_MODAL: return action.payload
    case CLOSE_USER_MODAL: return Object.assign({}, state, { show: false })
    default: return state
  }
}

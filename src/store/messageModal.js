// ------------------------------------
// Constants
// ------------------------------------
export const SET_MESSAGE_MODAL = 'SET_MESSAGE_MODAL'
export const CLOSE_MESSAGE_MODAL = 'CLOSE_MESSAGE_MODAL'

const initialState = {
  show: false,
  title: null,
  message: '',
  cancelBtnTxt: null,
  confirmBtnTxt: '확인',
  onConfirmClick: () => {},
  process: false
}
// ------------------------------------
// Actions
// ------------------------------------
export function setMessageModal (messageModal = initialState) {
  return {
    type    : SET_MESSAGE_MODAL,
    payload : Object.assign({}, initialState, messageModal)
  }
}

export function showMessageModal (messageModal = initialState) {
  return {
    type    : SET_MESSAGE_MODAL,
    payload : Object.assign({}, initialState, messageModal, { show: true })
  }
}

export function closeMessageModal () {
  return {
    type    : CLOSE_MESSAGE_MODAL
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function messageModalReducer (state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGE_MODAL: return action.payload
    case CLOSE_MESSAGE_MODAL: return Object.assign({}, state, { show: false })
    default: return state
  }
}

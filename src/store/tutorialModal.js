// ------------------------------------
// Constants
// ------------------------------------
export const SET_TUTORIAL_MODAL = 'SET_TUTORIAL_MODAL'

const initialState = {
  show: false,
  content: null,
  isHiddenImg: false,
  onClickContinue: () => {}
}
// ------------------------------------
// Actions
// ------------------------------------
export function setTutorialModal (tutorialModal = initialState) {
  return {
    type: SET_TUTORIAL_MODAL,
    payload: Object.assign({}, initialState, tutorialModal)
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function tutorialModalReducer (state = initialState, action) {
  switch (action.type) {
    case SET_TUTORIAL_MODAL: return action.payload
    default: return state
  }
}

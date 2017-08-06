import { combineReducers } from 'redux'
import userReducer from './user'
import messageModalReducer from './messageModal'
import pickMonInfoReducer from './pickMonInfo'
import { firebaseStateReducer } from 'react-redux-firebase'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    user: userReducer,
    messageModal: messageModalReducer,
    pickMonInfo: pickMonInfoReducer,
    firebase: firebaseStateReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

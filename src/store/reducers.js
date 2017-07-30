import { combineReducers } from 'redux'
import userReducer from './user'
import messageModalReducer from './messageModal'
import pickMonInfoReducer from './pickMonInfo'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    user: userReducer,
    messageModal: messageModalReducer,
    pickMonInfo: pickMonInfoReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

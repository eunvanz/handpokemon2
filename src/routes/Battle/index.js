import { injectReducer } from 'store/reducers'

export default (store) => ({
  path: 'battle',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Battle = require('./containers/BattleContainer').default
      const reducer = require('./modules/battle').default
      injectReducer(store, { key: 'battle', reducer })
      cb(null, Battle)
    }, 'battle')
  }
})

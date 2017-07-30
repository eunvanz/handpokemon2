export default (store) => ({
  path : 'pick-mon',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const PickMon = require('./containers/PickMonContainer').default
      cb(null, PickMon)
    }, 'pick-mon')
  }
})

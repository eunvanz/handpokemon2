export default (store) => ({
  path: 'workshop',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Workshop = require('./containers/WorkshopContainer').default
      cb(null, Workshop)
    }, 'workshop')
  }
})

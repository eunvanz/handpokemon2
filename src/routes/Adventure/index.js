export default (store) => ({
  path: 'adventure',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Adventure = require('./containers/AdventureContainer').default
      cb(null, Adventure)
    }, 'adventure')
  }
})

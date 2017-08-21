export default (store) => ({
  path: 'collection/:userId',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Collection = require('./containers/CollectionContainer').default
      cb(null, Collection)
    }, 'collection')
  }
})

export default (store) => ({
  path: 'honor',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Honor = require('./containers/HonorContainer').default
      cb(null, Honor)
    }, 'honor')
  }
})

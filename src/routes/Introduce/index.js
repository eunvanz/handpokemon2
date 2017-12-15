export default (store) => ({
  path: 'introduce',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Introduce = require('./containers/IntroduceContainer').default
      cb(null, Introduce)
    }, 'introduce')
  }
})

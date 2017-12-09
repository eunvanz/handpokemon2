export default (store) => ({
  path: '',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Home = require('./containers/HomeContainer').default
      cb(null, Home)
    }, 'home')
  }
})

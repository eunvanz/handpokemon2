export default (store) => ({
  path : 'sign-up',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const signUp = require('./containers/SignUpContainer').default
      cb(null, signUp)
    }, 'sign-up')
  }
})

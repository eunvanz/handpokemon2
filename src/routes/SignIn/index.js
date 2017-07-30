export default (store) => ({
  path : 'sign-in',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SignIn = require('./containers/SignInContainer').default
      cb(null, SignIn)
    }, 'sign-in')
  }
})

export default (store) => ({
  path: 'settings',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Setting = require('./containers/SettingContainer').default
      cb(null, Setting)
    }, 'setting')
  }
})

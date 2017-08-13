export default (store) => ({
  path : 'forbidden-area',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const MonManagement = require('./containers/MonManagementContainer').default
      cb(null, MonManagement)
    }, 'mon-management')
  }
})

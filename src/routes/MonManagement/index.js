export default (store) => ({
  path : 'you-are-forbidden',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const MonManagement = require('./containers/MonManagementContainer').default
      cb(null, MonManagement)
    }, 'mon-management')
  }
})

export default (store) => ({
  path: 'stage-management',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const StageManagement = require('./containers/StageManagementContainer').default
      cb(null, StageManagement)
    }, 'stage-management')
  }
})

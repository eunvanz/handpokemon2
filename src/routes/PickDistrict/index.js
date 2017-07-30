export default (store) => ({
  path : 'pick-district',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const PickDistrict = require('./containers/PickDistrictContainer').default
      cb(null, PickDistrict)
    }, 'pick-district')
  }
})

export default (store) => ({
  path: 'giftbox',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Giftbox = require('./containers/GiftboxContainer').default
      cb(null, Giftbox)
    }, 'giftbox')
  }
})

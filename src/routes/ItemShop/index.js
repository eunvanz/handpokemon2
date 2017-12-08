export default (store) => ({
  path: 'item-shop',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const ItemShop = require('./containers/ItemShopContainer').default
      cb(null, ItemShop)
    }, 'item-shop')
  }
})

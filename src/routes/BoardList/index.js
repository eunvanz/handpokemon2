export default (store) => ({
  path: 'board-list/:category',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const BoardList = require('./containers/BoardListContainer').default
      cb(null, BoardList)
    }, 'board-list')
  }
})

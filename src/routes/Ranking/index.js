export default (store) => ({
  path: 'ranking/:type',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Ranking = require('./containers/RankingContainer').default
      cb(null, Ranking)
    }, 'ranking')
  }
})


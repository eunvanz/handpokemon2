// export default (store) => ({
//   path: 'editor/:id',
//   getComponent (nextState, cb) {
//     require.ensure([], (require) => {
//       const Editor = require('./containers/EditorContainer').default
//       cb(null, Editor)
//     }, 'editor')
//   }
// })

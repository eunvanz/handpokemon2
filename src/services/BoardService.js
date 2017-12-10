export const postBoard = (firebase, board) => {
  const id = firebase.ref('boards').push().key
  board.id = id
  return firebase.ref(`boards/${id}`).update(board)
    .then(() => Promise.resolve(board))
}

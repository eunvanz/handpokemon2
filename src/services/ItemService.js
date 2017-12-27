import { convertMapToArr } from 'utils/commonUtil'

export const postItem = (firebase, item) => {
  const id = firebase.ref('items').push().key
  item.id = id
  return firebase.ref(`items/${id}`).update(item)
    .then(() => Promise.resolve(item))
}

export const getAllItems = (firebase) => {
  return firebase.ref('items').once('value').then(snapshot => convertMapToArr(snapshot.val()))
}

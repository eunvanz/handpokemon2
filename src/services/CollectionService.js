import { levelUpCollection } from 'utils/monUtil'
import { convertMapToArr } from 'utils/commonUtil'

export const postCollection = (firebase, userId, collection) => {
  return firebase.ref(`collections`).orderByChild('userId').equalTo(userId).once('value')
  .then(snapshot => {
    const userCollections = convertMapToArr(snapshot.val())
    console.log('userCollections', userCollections)
    const existCollection = userCollections.filter(col => col.monId === collection.monId).pop()
    console.log('existCollection', existCollection)
    if (!existCollection) {
      // mon이 user에게 없을경우
      return firebase.ref(`users/${userId}/colPoint`)
      .transaction(currentPoint => {
        return currentPoint + collection.mon.point
      })
      .then(() => {
        const collectionToPost = Object.assign({}, collection, { userId, mon: null })
        console.log('collection to post', collectionToPost)
        return firebase.push('collections', collectionToPost)
      })
      .then(snapshot => {
        const collectionToResolve = Object.assign({}, collection, { userId })
        console.log('collectionToResolve', collectionToResolve)
        return Promise.resolve({ asis: null, tobe: collectionToResolve })
      })
    } else {
      // mon이 user에게 있을경우
      const colId = existCollection.id
      let asis
      let tobe
      return firebase.ref(`collections/${colId}`)
      .once('value')
      .then(snapshot => {
        const asisCol = snapshot.val()
        return firebase.ref(`mons/${asisCol.monId}`)
        .once('value')
        .then(snapshot => {
          const mon = snapshot.val()
          // console.log('mon', { mon })
          const asisColMonAdded = Object.assign({}, asisCol, { mon })
          // console.log('asisColMonAdded', asisColMonAdded)
          // console.log('asisColMonAdded.mon', asisColMonAdded.mon)
          const tobeCol = levelUpCollection(asisColMonAdded)
          // console.log('tobeCol', tobeCol)
          asis = asisColMonAdded
          return Promise.resolve(tobeCol)
        })
        .then(tobeCol => {
          tobe = Object.assign({}, tobeCol)
          tobeCol.mon = null
          return firebase.update(`collections/${colId}`, tobeCol)
        })
        .then(() => {
          return Promise.resolve({ asis, tobe })
        })
      })
    }
  })
}

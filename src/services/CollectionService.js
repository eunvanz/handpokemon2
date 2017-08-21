import { levelUpCollection } from 'utils/monUtil'
import { convertMapToArr } from 'utils/commonUtil'

const getCollectionsRefUserIdAndMonId = (firebase, userId, monId) => {
  return firebase.ref(`userCollections/${userId}`).once('value') // 사용자의 콜렉션 가져옴
  .then(snapshot => {
    console.log('getCollectionRefUserIdAndMonId snapshot', snapshot)
    console.log('snapshot.val()', snapshot.val())
    console.log('snapshot.key', snapshot.key)
    return snapshot.ref.orderByChild('monId').equalTo(monId).limitToFirst(1).once('value') // 그 중에서 monId가 collection.monId와 같은 데이터를 가져옴
  })
}

export const getCollectionsByUserId = (firebase, userId) => {
  return firebase.ref(`userCollections/${userId}`).once('value')
  .then(snapshot => {
    const userCollections = convertMapToArr(snapshot.val())
    console.log('userCollections', userCollections)
    return Promise.resolve(userCollections)
  })
}

export const updateCollection = (firebase, col) => {
  const updateObj = {
    [`collections/${col.id}`]: col,
    [`userCollections/${col.userId}/${col.id}`]: col,
    [`monCollections/${col.monId}/${col.id}`]: col
  }
  return firebase.ref().update(updateObj)
}

export const deleteCollection = (firebase, col) => {
  return firebase.ref(`user/${col.userId}/colPoint`).once('value')
  .then(snapshot => {
    const asisPoint = snapshot.val()
    const tobePoint = asisPoint - col.mon[col.monId].point
    const updateObj = {
      [`collections/${col.id}`]: null,
      [`userCollections/${col.userId}/${col.id}`]: null,
      [`monCollections/${col.monId}/${col.id}`]: null,
      [`user/${col.userId}/colPoint`]: tobePoint
    }
    return firebase.ref().update(updateObj)
  })
}

export const postCollection = (firebase, userId, collection) => {
  return getCollectionsRefUserIdAndMonId(firebase, userId, collection.monId) // userId와 monId로 콜렉션을 가져옴
  .then(snapshot => {
    console.log('postCollection snapshot', snapshot)
    if (!snapshot.val()) { // mon이 user에게 없을경우
      return firebase.ref(`users/${userId}/colPoint`)
      .transaction(currentPoint => {
        // user의 콜렉션점수 상승
        return currentPoint + collection.mon[collection.monId].point
      })
      .then(() => {
        // 콜렉션을 생성함
        const collectionToPost = Object.assign({}, collection, { userId }) // 콜렉션
        console.log('collection to post', collectionToPost)
        const newCollectionKey = firebase.push('collections', collectionToPost).key // collections에 추가
        console.log('newCollectionKey', newCollectionKey)
        // userCollections, monCollections에 추가
        const updateObj = {
          [`monCollections/${collection.monId}/${newCollectionKey}`]: collectionToPost,
          [`userCollections/${userId}/${newCollectionKey}`]: collectionToPost
        }
        return firebase.ref().update(updateObj)
        .then(() => {
          return Promise.resolve({ asis: null, tobe: collectionToPost })
        })
      })
    } else {
      // mon이 user에게 있을경우: 레벨업
      let colId
      let asis
      snapshot.forEach(snap => {
        colId = snap.key
        asis = snap.val()
      })
      console.log('colId', colId)
      console.log('asis', asis)
      let tobe = levelUpCollection(asis)
      console.log('tobe', tobe)
      // collections와 userCollections 다중 업데이트
      const updateObj = {
        [`collections/${colId}`]: tobe,
        [`userCollections/${userId}/${colId}`]: tobe,
        [`monCollections/${tobe.monId}/${colId}`]: tobe
      }
      return firebase.ref().update(updateObj)
      .then(() => {
        return Promise.resolve({ asis, tobe })
      })
    }
  })
}

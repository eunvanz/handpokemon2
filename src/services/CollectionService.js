import { levelUpCollection, levelDownCollection } from 'utils/monUtil'
import { convertMapToArr, updater } from 'utils/commonUtil'

const getCollectionsRefUserIdAndMonId = (firebase, userId, monId) => {
  return firebase.ref(`userCollections/${userId}`).once('value') // 사용자의 콜렉션 가져옴
  .then(snapshot => {
    console.log('getCollectionRefUserIdAndMonId snapshot', snapshot)
    console.log('snapshot.val()', snapshot.val())
    console.log('snapshot.key', snapshot.key)
    return snapshot.ref.orderByChild('monId').equalTo(monId).limitToFirst(1).once('value') // 그 중에서 monId가 collection.monId와 같은 데이터를 가져옴
  })
}

const getUpdateColObj = col => {
  const updateObj = {
    [`collections/${col.id}`]: col,
    [`userCollections/${col.userId}/${col.id}`]: col,
    [`monCollections/${col.monId}/${col.id}`]: col
  }
  return updateObj
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

export const postCollection = (firebase, userId, collection, type, srcCols) => {
  let updateObj = {}
  const collectionMon = collection.mon[collection.monId]
  let asis = null
  let tobe = null
  return getCollectionsRefUserIdAndMonId(firebase, userId, collection.monId) // userId와 monId로 콜렉션을 가져옴
  .then(snapshot => {
    if (!snapshot.val()) { // mon이 user에게 없을경우
      return firebase.ref(`users/${userId}/colPoint`).once('value')
      .then(snapshot => {
        const curPoint = snapshot.val()
        updateObj[`users/${userId}/colPoint`] = curPoint + collectionMon.point
        // 콜렉션을 생성함
        tobe = Object.assign({}, collection, { userId }) // 콜렉션
        const newCollectionKey = firebase.push('collections').key // collections에 추가
        // userCollections, monCollections에 추가
        tobe.id = newCollectionKey
        const updateColObj = {
          [`collections/${newCollectionKey}`]: tobe,
          [`monCollections/${collection.monId}/${newCollectionKey}`]: tobe,
          [`userCollections/${userId}/${newCollectionKey}`]: tobe
        }
        console.log('updateColObj', updateColObj)
        updateObj = Object.assign({}, updateObj, updateColObj)
        return Promise.resolve()
      })
    } else { // mon이 user에게 있을경우: 레벨업
      let colId
      snapshot.forEach(snap => {
        colId = snap.key
        asis = snap.val()
      })
      tobe = levelUpCollection(asis)
      // collections와 userCollections 다중 업데이트
      const updateColObj = {
        [`collections/${colId}`]: tobe,
        [`userCollections/${userId}/${colId}`]: tobe,
        [`monCollections/${tobe.monId}/${colId}`]: tobe
      }
      console.log('updateColObj', updateColObj)
      updateObj = Object.assign({}, updateObj, updateColObj)
      return Promise.resolve()
    }
  })
  .then(() => {
    // type에 따른 구분
    if (type === 'pick') { // 채집의 경우 유저의 크레딧 감소
      // 복잡해서 따로 뺌 (UserService.decreaseCredit())
      return Promise.resolve()
    } else if (type === 'evolution') { // 진화의 경우 이전콜렉션에 대한 레벨 다운 혹은 삭제
      const srcCol = srcCols[0]
      let updateSrcColObj
      if (srcCol.level <= srcCol.mon[srcCol.monId].evoLv) { // 진회레벨과 같거나 작을경우 삭제
        return firebase.ref(`user/${userId}/colPoint`).once('value')
        .then(snapshot => {
          const asisPoint = snapshot.val()
          const tobePoint = asisPoint - collection.mon[collection.monId].point
          updateSrcColObj = {
            [`collections/${srcCol.id}`]: null,
            [`userCollections/${srcCol.userId}/${srcCol.id}`]: null,
            [`monCollections/${srcCol.monId}/${srcCol.id}`]: null,
            [`user/${srcCol.userId}/colPoint`]: tobePoint
          }
          console.log('updateSrcColObj', updateSrcColObj)
          updateObj = Object.assign({}, updateObj, updateSrcColObj)
          return Promise.resolve()
        })
      } else { // 레벨다운
        updateSrcColObj = getUpdateColObj(levelDownCollection(srcCol))
        console.log('updateSrcColObj', updateSrcColObj)
        updateObj = Object.assign({}, updateObj, updateSrcColObj)
        return Promise.resolve()
      }
    }
  })
  .then(() => {
    console.log('updateObj', updateObj)
    return firebase.ref().update(updateObj)
  })
  .then(() => {
    return Promise.resolve({ asis, tobe })
  })
}

// export const postCollection = (firebase, userId, collection) => {
//   return getCollectionsRefUserIdAndMonId(firebase, userId, collection.monId) // userId와 monId로 콜렉션을 가져옴
//   .then(snapshot => {
//     console.log('postCollection snapshot', snapshot)
//     if (!snapshot.val()) { // mon이 user에게 없을경우
//       return firebase.ref(`users/${userId}/colPoint`)
//       .transaction(currentPoint => {
//         // user의 콜렉션점수 상승
//         return currentPoint + collection.mon[collection.monId].point
//       })
//       .then(() => {
//         // 콜렉션을 생성함
//         const collectionToPost = Object.assign({}, collection, { userId }) // 콜렉션
//         console.log('collection to post', collectionToPost)
//         const newCollectionKey = firebase.push('collections', collectionToPost).key // collections에 추가
//         console.log('newCollectionKey', newCollectionKey)
//         // userCollections, monCollections에 추가
//         const updateObj = {
//           [`monCollections/${collection.monId}/${newCollectionKey}`]: collectionToPost,
//           [`userCollections/${userId}/${newCollectionKey}`]: collectionToPost
//         }
//         return firebase.ref().update(updateObj)
//         .then(() => {
//           return Promise.resolve({ asis: null, tobe: collectionToPost })
//         })
//       })
//     } else {
//       // mon이 user에게 있을경우: 레벨업
//       let colId
//       let asis
//       snapshot.forEach(snap => {
//         colId = snap.key
//         asis = snap.val()
//       })
//       console.log('colId', colId)
//       console.log('asis', asis)
//       let tobe = levelUpCollection(asis)
//       console.log('tobe', tobe)
//       // collections와 userCollections 다중 업데이트
//       const updateObj = {
//         [`collections/${colId}`]: tobe,
//         [`userCollections/${userId}/${colId}`]: tobe,
//         [`monCollections/${tobe.monId}/${colId}`]: tobe
//       }
//       return firebase.ref().update(updateObj)
//       .then(() => {
//         return Promise.resolve({ asis, tobe })
//       })
//     }
//   })
// }

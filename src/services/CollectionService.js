import { levelUpCollection, levelDownCollection } from 'utils/monUtil'
import { convertMapToArr, updater } from 'utils/commonUtil'

const getCollectionsRefUserIdAndMonId = (firebase, userId, monId) => {
  return firebase.ref(`userCollections/${userId}`).once('value') // 사용자의 콜렉션 가져옴
  .then(snapshot => {
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

export const getDeleteColObj = (firebase, col) => {
  return firebase.ref(`user/${col.userId}/colPoint`).once('value')
    .then(snapshot => {
      const asisPoint = snapshot.val()
      const tobePoint = asisPoint - col.mon[col.monId].point
      const updateObj = {
        [`collections/${col.id}`]: null,
        [`userCollections/${col.userId}/${col.id}`]: null,
        [`monCollections/${col.monId}/${col.id}`]: null,
        [`users/${col.userId}/colPoint`]: tobePoint
      }
      return Promise.resolve(updateObj)
    })
}

const getResolveLevelDownObj = (firebase, srcCol, type) => {
  if (srcCol.level <= srcCol.mon[srcCol.monId].evoLv) { // 진회레벨과 같거나 작을경우 삭제
    return firebase.ref(`user/${srcCol.userId}/colPoint`).once('value')
      .then(snapshot => {
        const asisPoint = snapshot.val()
        const tobePoint = asisPoint - srcCol.mon[srcCol.monId].point
        const updateSrcColObj = {
          [`collections/${srcCol.id}`]: null,
          [`userCollections/${srcCol.userId}/${srcCol.id}`]: null,
          [`monCollections/${srcCol.monId}/${srcCol.id}`]: null,
          [`users/${srcCol.userId}/colPoint`]: tobePoint
        }
        return Promise.resolve(updateSrcColObj)
      })
  } else { // 레벨다운
    const updateSrcColObj = getUpdateColObj(levelDownCollection(srcCol, type === 'mix' ? 1 : null))
    return Promise.resolve(updateSrcColObj)
  }
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
      return getResolveLevelDownObj(firebase, srcCol, type)
      .then(updateSrcColObj => {
        updateObj = Object.assign({}, updateObj, updateSrcColObj)
        return Promise.resolve()
      })
    } else if (type === 'mix') {
      // srcCols에 대해 levelDown처리
      const promArr = srcCols.map(srcCol => {
        return getResolveLevelDownObj(firebase, srcCol, type)
      })
      return Promise.all(promArr)
      .then(result => {
        updateObj = Object.assign({}, updateObj, ...result)
        return Promise.resolve()
      })
    }
  })
  .then(() => {
    console.log('updateObj', updateObj)
    return updater(firebase, updateObj)
  })
  .then(() => {
    return Promise.resolve({ asis, tobe })
  })
}

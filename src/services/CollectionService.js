import { levelUpCollection, levelDownCollection } from 'utils/monUtil'
import { convertMapToArr, updater, convertNumberToStringForIndex } from 'utils/commonUtil'
import keygen from 'keygenerator'
import { sortBy, orderBy } from 'lodash'

import { getUserByUserId } from './UserService'

import Lucky from 'models/lucky'

import { LEAGUE } from 'constants/rules'

export const getCollectionsRefUserIdAndMonId = (firebase, userId, monId) => {
  return firebase.ref(`userCollections/${userId}`).once('value') // 사용자의 콜렉션 가져옴
  .then(snapshot => {
    return snapshot.ref.orderByChild('monId').equalTo(monId).limitToFirst(1).once('value') // 그 중에서 monId가 collection.monId와 같은 데이터를 가져옴
  })
}

export const getUpdateColObj = col => {
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
  return firebase.ref(`users/${col.userId}`).once('value')
    .then(snapshot => {
      const user = snapshot.val()
      const asisPoint = user.colPoint
      const leaguePoint = user.leaguePoint
      const tobePoint = asisPoint - col.mon[col.monId].point
      const updateObj = {
        [`collections/${col.id}`]: null,
        [`userCollections/${col.userId}/${col.id}`]: null,
        [`monCollections/${col.monId}/${col.id}`]: null,
        [`users/${col.userId}/colPoint`]: tobePoint,
        [`users/${col.userId}/colPoint_leaguePoint`]: convertNumberToStringForIndex([tobePoint, leaguePoint]),
        [`users/${col.userId}/leaguePoint_colPoint`]: convertNumberToStringForIndex([leaguePoint, tobePoint])
      }
      return Promise.resolve(updateObj)
    })
}

const getResolveLevelDownObj = (firebase, srcCol, type, asisPoint, leaguePoint) => {
  // let isError = false
  // firebase.ref(`collections/${srcCol.id}/level`).transaction(asisLevel => {
  //   if (asisLevel - srcCol.mon[srcCol.monId].evoLv < 0) {
  //     isError = true
  //     return asisLevel
  //   }
  //   return asisLevel - srcCol.mon[srcCol.monId].evoLv
  // })
  // if (isError || srcCol.level < 0) return Promise.reject('선택한 콜렉션이 존재하지 않습니다.')
  const levelToCompare = type === 'mix' ? 1 : srcCol.mon[srcCol.monId].evoLv
  if (srcCol.level <= levelToCompare) { // 진회레벨과 같거나 작을경우 삭제
    const tobePoint = asisPoint - srcCol.mon[srcCol.monId].point
    const updateSrcColObj = {
      [`collections/${srcCol.id}`]: null,
      [`userCollections/${srcCol.userId}/${srcCol.id}`]: null,
      [`monCollections/${srcCol.monId}/${srcCol.id}`]: null,
      [`users/${srcCol.userId}/colPoint`]: tobePoint,
      [`users/${srcCol.userId}/colPoint_leaguePoint`]: convertNumberToStringForIndex([tobePoint, leaguePoint]),
      [`users/${srcCol.userId}/leaguePoint_colPoint`]: convertNumberToStringForIndex([leaguePoint, tobePoint])
    }
    return Promise.resolve(updateSrcColObj)
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
  let resultPoint
  let leaguePoint
  let checkSrcCols
  let isError = false
  let user
  if (type === 'evolution' || type === 'mix') {
    const proms = srcCols.map(srcCol => {
      return () => firebase.ref(`collections/${srcCol.id}/level`).transaction(asisLevel => {
        const numberToMinus = type === 'evolution' ? srcCol.mon[srcCol.monId].evoLv : 1
        if (asisLevel - numberToMinus < 0) {
          isError = true
          return asisLevel
        } else return asisLevel - numberToMinus // 정합성을 위해 마이너스 처리, 나중에 업데이트 할때 정상적으로 함
      })
    })
    checkSrcCols = () => Promise.all(proms)
  } else {
    checkSrcCols = () => Promise.resolve()
  }
  return checkSrcCols()
  .then(() => {
    if (isError) return Promise.reject('콜렉션이 존재하지 않습니다.')
    return firebase.ref(`users/${userId}`).once('value')
  })
  .then(snapshot => {
    user = snapshot.val()
    resultPoint = user.colPoint
    leaguePoint = user.leaguePoint
    if (collectionMon.grade !== 'b' && (collectionMon.grade === 'e' || collectionMon.grade === 'l')) { // 방송되는 포켓몬을 뽑았을경우
      updateObj = {
        [`luckies/${keygen._()}`]: Object.assign({}, new Lucky(), { user, collection, type })
      }
    }
    return getCollectionsRefUserIdAndMonId(firebase, userId, collection.monId) // userId와 monId로 콜렉션을 가져옴
  })
  .then(snapshot => {
    if (!snapshot.val()) { // mon이 user에게 없을경우
      if (collectionMon.grade !== 'b' && (collection.rank === 'SS' || collection.rank === 'S')) { // 새포켓몬인 경우에만 체크
        updateObj = {
          [`luckies/${keygen._()}`]: Object.assign({}, new Lucky(), { user, collection, type })
        }
      }
      resultPoint += collectionMon.point
      const updateUserObj = {
        [`users/${userId}/colPoint`]: resultPoint,
        [`users/${userId}/colPoint_leaguePoint`]: convertNumberToStringForIndex([resultPoint, leaguePoint]),
        [`users/${userId}/leaguePoint_colPoint`]: convertNumberToStringForIndex([leaguePoint, resultPoint])
      }
      updateObj = Object.assign({}, updateObj, updateUserObj)
      // 콜렉션을 생성함
      tobe = Object.assign({}, collection, { userId, isDefender: type === 'signUp' }) // 콜렉션
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
      return getResolveLevelDownObj(firebase, srcCol, type, resultPoint, leaguePoint)
      .then(updateSrcColObj => {
        updateObj = Object.assign({}, updateObj, updateSrcColObj)
        return Promise.resolve()
      })
    } else if (type === 'mix') {
      // srcCols에 대해 levelDown처리
      let promArr = []
      let subResultPoint = resultPoint
      srcCols.forEach((srcCol, idx) => {
        if (idx === 1 && srcCols[0].level === 1) subResultPoint -= srcCols[0].mon[srcCols[0].monId].point
        promArr.push(getResolveLevelDownObj(firebase, srcCol, type, subResultPoint, leaguePoint))
      })
      // const promArr = srcCols.map(srcCol => getResolveLevelDownObj(firebase, srcCol, type, resultPoint, leaguePoint))
      return Promise.all(promArr)
      .then(result => {
        updateObj = Object.assign({}, updateObj, ...result)
        return Promise.resolve()
      })
      .catch(msgArr => {
        let concatMsg
        msgArr.forEach(msg => {
          concatMsg += `${msg} `
        })
        return Promise.reject(concatMsg)
      })
    }
  })
  .then(() => {
    return updater(firebase, updateObj)
  })
  .then(() => {
    return Promise.resolve({ asis, tobe })
  })
  .catch(msg => {
    return Promise.reject(msg)
  })
}

export const toggleFavorite = (firebase, col, isFavorite) => {
  const updateObj = {
    [`collections/${col.id}/isFavorite`]: isFavorite,
    [`userCollections/${col.userId}/${col.id}/isFavorite`]: isFavorite,
    [`monCollections/${col.monId}/${col.id}/isFavorite`]: isFavorite
  }
  return updater(firebase, updateObj)
}

export const updateIsDefender = (firebase, col, isDefender) => {
  const updateObj = {
    [`collections/${col.id}/isDefender`]: isDefender,
    [`userCollections/${col.userId}/${col.id}/isDefender`]: isDefender,
    [`monCollections/${col.monId}/${col.id}/isDefender`]: isDefender
  }
  return updater(firebase, updateObj)
}

export const getDefendersByUserId = (firebase, userId) => {
  const ref = firebase.ref(`userCollections/${userId}`)
  return ref.orderByChild('isDefender').equalTo(true).once('value')
  .then(snapshot => {
    return Promise.resolve(convertMapToArr(snapshot.val()))
  })
}

export const setDefendersToMaxCostByUserId = (firebase, userId) => {
  return getUserByUserId(firebase, userId)
  .then(user => {
    const userLeague = user.league
    const newMaxCost = LEAGUE[userLeague].maxCost
    return getCollectionsByUserId(firebase, userId)
    .then(userCollections => {
      const defendersArr = userCollections.filter(col => col.isDefender)
      const currentCost = defendersArr.reduce((accm, col) => accm + col.mon[col.monId].cost, 0)
      if (newMaxCost !== currentCost) {
        const isPromoted = newMaxCost > currentCost
        // 강등됐을 경우는 코스트가 가장 큰 포켓몬 보다 코스트가 작은 아래 포켓몬으로 교체, 상승했을 경우는 코스트가 가장 작은 포켓몬을 큰 포켓몬으로 교체
        const colToPop = sortBy(defendersArr, col => col.mon[col.monId].cost)[isPromoted ? 0 : defendersArr.length - 1] // 가장 큰 코스트 또는 작은 코스트의 포켓몬
        const suitableCostCols = userCollections.filter(col => {
          if (!col) return false
          if (isPromoted) {
            return col.mon[col.monId].cost <= colToPop.mon[colToPop.monId].cost - (currentCost - newMaxCost) && col.mon[col.monId].cost > colToPop.mon[colToPop.monId].cost
          } else {
            return col.mon[col.monId].cost <= colToPop.mon[colToPop.monId].cost - (currentCost - newMaxCost)
          }
        })
        const availableCols = suitableCostCols.filter(col => !col.isDefender)
        if (availableCols.length === 0) {
          // 없을 경우 공석으로 냅둠
          if (!isPromoted) return updateIsDefender(firebase, colToPop, false)
          else return Promise.resolve()
        } else {
          // 교체 가능한 콜렉션 중에서 가장 전투력이 높은 포켓몬을 defender로 설정
          const maxTotalCol = sortBy(availableCols, col => col.total + col.addedTotal)[availableCols.length - 1]
          return updateIsDefender(firebase, colToPop, false)
          .then(() => updateIsDefender(firebase, maxTotalCol, true))
        }
      } else {
        return Promise.resolve()
      }
    })
  })
}

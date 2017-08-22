import { convertMapToArr } from 'utils/commonUtil'
import { convertMonToCol, convertNextMonToCol } from 'utils/monUtil'

import _ from 'lodash'

export const getStartPick = firebase => {
  console.log('여기안오냐')
  const monsRef = firebase.ref('mons')
  return monsRef.orderByChild('grade').equalTo('b').once('value')
  .then(snapshot => {
    const basicMons = {}
    snapshot.forEach(snap => {
      const monId = snap.key
      const mon = snap.val()
      console.log('monId', monId)
      mon.id = monId
      basicMons[monId] = mon
    })
    console.log('basicMons', basicMons)
    const keys = Object.keys(basicMons)
    const idxSet = new Set()
    const qtyToPick = 3
    while (idxSet.size < qtyToPick) {
      const idx = Math.floor(Math.random() * keys.length)
      idxSet.add(idx)
    }
    const startPick = _.shuffle(keys.filter((key, idx) => idxSet.has(idx)).map(key => convertMonToCol(basicMons[key])))
    return Promise.resolve(startPick)
  })
}

export const getPickMons = (firebase, attrs, grades) => {
  return firebase.ref('mons').once('value')
  .then(snapshot => {
    const mons = convertMapToArr(snapshot.val())
    let picks = mons.filter(mon => {
      return _.includes(attrs, mon.mainAttr) && _.includes(grades, mon.grade)
    })
    const takedPick = _.take(_.shuffle(picks), 5)
    return Promise.resolve(takedPick.map(pick => convertMonToCol(pick)))
  })
}

export const getNextMons = (firebase, evoluteCol) => {
  const nextIds = evoluteCol.mon[evoluteCol.monId].next
  return firebase.ref('mons').once('value')
  .then(snapshot => {
    const mons = snapshot.val()
    console.log('mons', mons)
    const nextMons = nextIds.map(nextId => Object.assign({}, mons[nextId], { id: nextId }))
    console.log('nextMons', nextMons)
    const nextCols = _.shuffle(nextMons.map(nextMon => convertMonToCol(nextMon)))
    console.log('nextCols', nextCols)
    return Promise.resolve(nextCols)
  })
}

export const postMon = (firebase, mon) => {
  return firebase.push('mons', mon)
}

export const updateMon = (firebase, mon) => {
  // mons, collections, monCollections, userCollections 모두 업데이트
  const collectionsPaths = []
  const monCollectionsPaths = []
  const userCollectionsPaths = []
  let updateObj
  let tobeMon
  return firebase.ref(`mons/${mon.id}`).once('value')
  .then(snapshot => {
    const asisMon = snapshot.val()
    console.log('asisMon', asisMon)
    tobeMon = Object.assign({}, asisMon, mon)
    console.log('tobeMon', tobeMon)
    updateObj = {
      [`mons/${mon.id}`]: tobeMon
    }
    return firebase.ref(`monCollections/${mon.id}`).once('value')
  })
  .then(snapshot => {
    console.log('snapshot.val()', snapshot.val())
    if (snapshot.val()) { // 콜렉션이 있는경우
      const collectionIds = Object.keys(snapshot.val())
      collectionIds.forEach(colId => {
        monCollectionsPaths.push(`monCollections/${mon.id}/${colId}/mon/${mon.id}`)
        collectionsPaths.push(`collections/${colId}/mon/${mon.id}`)
      })
    }
    return firebase.ref('collections').orderByChild('monId').equalTo(mon.id).once('value')
  })
  .then(snapshot => {
    snapshot.forEach(snap => {
      const colId = snap.key
      const userId = snap.val().userId
      userCollectionsPaths.push(`userCollections/${userId}/${colId}/mon/${mon.id}`)
    })
    const merge = _.concat(collectionsPaths, monCollectionsPaths, userCollectionsPaths)
    merge.forEach(elem => {
      updateObj[elem] = tobeMon
    })
    return firebase.ref().update(updateObj)
  })
}

export const updateMonWithRoute = (firebase, route, value) => {
  return firebase.update(`mons/${route}`, value)
}

export const deleteMon = (firebase, mon) => {
  return firebase.remove(`mons/${mon.id}`)
}

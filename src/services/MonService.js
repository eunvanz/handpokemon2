import { convertMapToArr } from 'utils/commonUtil'
import { convertMonToCol, levelUpCollection } from 'utils/monUtil'

import _ from 'lodash'

export const getStartPick = firebase => {
  const monsRef = firebase.ref('mons')
  return monsRef.orderByChild('grade').equalTo('b').once('value')
  .then(snapshot => {
    const basicMons = {}
    snapshot.forEach(snap => {
      const monId = snap.key
      const mon = snap.val()
      mon.id = monId
      basicMons[monId] = mon
    })
    const keys = Object.keys(basicMons)
    let idxSet
    let totalCost = 12
    while (totalCost > 11 || totalCost < 10) {
      idxSet = new Set()
      const qtyToPick = 3
      while (idxSet.size < qtyToPick) {
        const idx = Math.floor(Math.random() * keys.length)
        idxSet.add(idx)
      }
      totalCost = keys.filter((key, idx) => idxSet.has(idx)).reduce((accm, key) => accm + basicMons[key].cost, 0)
    }
    const startPick = _.shuffle(keys.filter((key, idx) => idxSet.has(idx)).map(key => convertMonToCol(basicMons[key])))
    return Promise.resolve(startPick)
  })
}

export const getStagePick = (firebase, totalAbility) => {
  const monsRef = firebase.ref('mons')
  return monsRef.orderByChild('total').once('value')
  .then(snapshot => {
    const allPicks = []
    snapshot.forEach(snap => {
      const monId = snap.key
      const mon = snap.val()
      mon.id = monId
      allPicks.push(mon)
    })
    const resultPicks = []
    for (let i = 0; i < 3; i++) {
      let cut
      if (i === 0) cut = totalAbility - allPicks[0].total - allPicks[1].total
      else if (i === 1) cut = totalAbility - resultPicks[0].total - allPicks[0].total
      else if (i === 2) cut = totalAbility - resultPicks[0].total - resultPicks[1].total
      let filteredPicks = allPicks.filter(pick => pick.total < cut)
      filteredPicks = filteredPicks.filter(pick => _.find(resultPicks, e => e.id === pick.id) == null)
      const length = filteredPicks.length
      const pickIdx = _.random(0, length - 1)
      resultPicks.push(filteredPicks[pickIdx])
    }
    let resultTotal = resultPicks.reduce((accm, pick) => accm + pick.total, 0)
    const resultCollectionPicks = resultPicks.map(pick => convertMonToCol(pick))
    while (resultTotal < totalAbility) {
      // totalAbility를 넘어설때 까지 레벨업
      const idx = _.random(0, 2)
      resultCollectionPicks[idx] = levelUpCollection(resultCollectionPicks[idx])
      resultTotal = resultCollectionPicks.reduce((accm, pick) => accm + pick.total + pick.addedTotal, 0)
    }
    return Promise.resolve(resultCollectionPicks)
  })
}

export const getPickMons = (firebase, attrs, grades, mixCols) => {
  // TODO: 특정 포켓몬 교배처리 해야함
  return firebase.ref('mons').once('value')
  .then(snapshot => {
    const mons = convertMapToArr(snapshot.val())
    let picks = mons.filter(mon => {
      if (mixCols) return _.includes(attrs, mon.mainAttr) && _.includes(grades, mon.grade) && !_.includes([mixCols[0].monId, mixCols[1].monId], mon.id)
      return _.includes(attrs, mon.mainAttr) && _.includes(grades, mon.grade)
    })
    const takedPick = _.take(_.shuffle(picks), 5)
    return Promise.resolve(takedPick.map(pick => convertMonToCol(pick)))
  })
}

export const getNextMons = (firebase, evoluteCol) => {
  const nextIds = _.compact(evoluteCol.mon[evoluteCol.monId].next)
  return firebase.ref('mons').once('value')
  .then(snapshot => {
    const mons = snapshot.val()
    const nextMons = nextIds.map(nextId => Object.assign({}, mons[nextId], { id: nextId }))
    const nextCols = _.shuffle(nextMons.map(nextMon => convertMonToCol(nextMon)))
    return Promise.resolve(nextCols)
  })
}

export const postMon = (firebase, mon) => {
  const id = firebase.ref('mons').push().key
  mon.id = id
  return firebase.ref(`mons/${id}`).update(mon)
  .then(() => Promise.resolve(mon))
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
    tobeMon = Object.assign({}, asisMon, mon)
    updateObj = {
      [`mons/${mon.id}`]: tobeMon
    }
    return firebase.ref(`monCollections/${mon.id}`).once('value')
  })
  .then(snapshot => {
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
    console.log('updateObj', updateObj)
    return firebase.ref().update(updateObj)
  })
}

export const updateMonWithRoute = (firebase, route, value) => {
  return firebase.update(`mons/${route}`, value)
}

export const deleteMon = (firebase, mon) => {
  return firebase.remove(`mons/${mon.id}`)
}

export const getMonById = (firebase, monId) => {
  return firebase.ref(`mons/${monId}`).once('value').then(snapshot => snapshot.val())
}

export const getMonByNo = (firebase, no) => {
  return firebase.ref(`mons`).orderByChild('no').equalTo(no).once('value').then(snapshot => snapshot.val())
}

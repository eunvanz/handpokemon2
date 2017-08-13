import { convertMapToArr } from 'utils/commonUtil'
import { convertMonToCol } from 'utils/monUtil'

import _ from 'lodash'

export const getStartPick = firebase => {
  const ref = firebase.ref('mons')
  return ref.once('value')
  .then(snapshot => {
    const mons = convertMapToArr(snapshot.val())
    return Promise.resolve(mons.filter(mon => mon.grade === 'b'))
  })
  .then(basicMons => {
    const idxSet = new Set()
    const qtyToPick = 3
    while (idxSet.size < qtyToPick) {
      const idx = Math.floor(Math.random() * basicMons.length)
      idxSet.add(idx)
    }
    const startPick = _.shuffle(basicMons.filter((mon, idx) => idxSet.has(idx)).map(mon => convertMonToCol(mon)))
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

export const postMon = (firebase, mon) => {
  return firebase.push('mons', mon)
}

export const updateMon = (firebase, mon) => {
  return firebase.update(`mons/${mon.id}`, mon)
}

export const updateMonWithRoute = (firebase, route, value) => {
  return firebase.update(`mons/${route}`, value)
}

export const deleteMon = (firebase, mon) => {
  return firebase.remove(`mons/${mon.id}`)
}

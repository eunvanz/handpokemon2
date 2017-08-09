import { getStartPick as getDummyStartPick, getPicks } from 'dummy/mon'

export const getStartPick = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pick = getDummyStartPick()
      resolve(pick)
    }, 1000)
  })
}

export const getPickMons = (attrs, grades) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(getPicks(attrs, grades))
    }, 1000)
  })
}

export const postMon = (firebase, mon) => {
  return firebase.push('mons', mon)
}

export const updateMon = (firebase, mon) => {
  console.log('updateMon > mon', mon)
  return firebase.update(`mons/${mon.id}`, mon)
}

export const updateMonWithRoute = (firebase, route, value) => {
  return firebase.update(`mons/${route}`, value)
}

export const deleteMon = (firebase, mon) => {
  return firebase.remove(`mons/${mon.id}`)
}

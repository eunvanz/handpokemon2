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

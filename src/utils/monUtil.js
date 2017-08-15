import { RANK } from 'constants/rules'
import collection from 'models/collection'

import _ from 'lodash'

export const getMonImage = mon => {
  if (mon.mon[mon.monId]) {
    return mon.mon[mon.monId].monImage.filter(monImage => mon.imageSeq === monImage.seq)[0]
  } else {
    return mon.monImage[0]
  }
}

export const getRandomStat = (stat) => {
  const idx = _.random(0, 100)
  if (idx > 100 - RANK.SS.chance) {
    return _.round(stat * _.random(RANK.SS.range.min, RANK.SS.range.max))
  } else if (idx > 100 - RANK.SS.chance - RANK.S.chance) {
    return _.round(stat * _.random(RANK.S.range.min, RANK.S.range.max))
  } else if (idx > 100 - RANK.SS.chance - RANK.S.chance - RANK.A.chance) {
    return _.round(stat * _.random(RANK.A.range.min, RANK.A.range.max))
  } else if (idx > 100 - RANK.SS.chance - RANK.S.chance - RANK.A.chance - RANK.B.chance) {
    return _.round(stat * _.random(RANK.B.range.min, RANK.B.range.max))
  } else if (idx > 100 - RANK.SS.chance - RANK.S.chance - RANK.A.chance - RANK.B.chance - RANK.C.chance) {
    return _.round(stat * _.random(RANK.C.range.min, RANK.C.range.max))
  } else if (idx > 100 - RANK.SS.chance - RANK.S.chance - RANK.A.chance - RANK.B.chance - RANK.C.chance - RANK.D.chance) {
    return _.round(stat * _.random(RANK.D.range.min, RANK.D.range.max))
  } else if (idx > 100 - RANK.SS.chance - RANK.S.chance - RANK.A.chance - RANK.B.chance - RANK.C.chance - RANK.D.chance - RANK.E.chance) {
    return _.round(stat * _.random(RANK.E.range.min, RANK.E.range.max))
  } else {
    return _.round(stat * _.random(RANK.F.range.min, RANK.F.range.max))
  }
}

export const getRank = (total, monTotal) => {
  const ratio = total / monTotal
  if (ratio >= RANK.SS.range.min) return 'SS'
  else if (ratio >= RANK.S.range.min) return 'S'
  else if (ratio >= RANK.A.range.min) return 'A'
  else if (ratio >= RANK.B.range.min) return 'B'
  else if (ratio >= RANK.C.range.min) return 'C'
  else if (ratio >= RANK.D.range.min) return 'D'
  else if (ratio >= RANK.E.range.min) return 'E'
  else if (ratio >= RANK.F.range.min) return 'F'
}

export const convertMonToCol = mon => {
  console.log('mon to convert', mon)
  const hp = getRandomStat(mon.hp)
  const power = getRandomStat(mon.power)
  const armor = getRandomStat(mon.armor)
  const sPower = getRandomStat(mon.sPower)
  const sArmor = getRandomStat(mon.sArmor)
  const dex = getRandomStat(mon.dex)
  const total = hp + power + armor + sPower + sArmor + dex
  const rank = getRank(total, mon.total)
  const height = _.round(mon.height * _.random(0.5, 1.5), 1)
  const weight = _.round(mon.weight * _.random(0.5, 1.5), 1)
  const col = Object.assign({}, collection, { mon: { [mon.id]: mon } },
    { hp, power, armor, sPower, sArmor, dex, rank, monId: mon.id, level: 1, total, height, weight, imageSeq: mon.monImage[0].seq })
  return col
}

export const levelUpCollection = col => {
  // console.log('levelup param col', col)
  // console.log('point', col.mon.point)
  const updateObj = {}
  for (let i = 0; i < col.mon[col.monId].point; i++) {
    const idx = _.random(1, 6)

    if (idx === 1) updateObj.addedHp = col.addedHp + 1
    else if (idx === 2) updateObj.addedPower = col.addedPower + 1
    else if (idx === 3) updateObj.addedArmor = col.addedArmor + 1
    else if (idx === 4) updateObj.addedSPower = col.addedSPower + 1
    else if (idx === 5) updateObj.addedSArmor = col.addedSArmor + 1
    else updateObj.addedDex = col.addedDex + 1
  }
  updateObj.level = col.level + 1
  updateObj.addedTotal = col.mon[col.monId].point
  // console.log('updateObj', updateObj)
  return Object.assign({}, col, updateObj)
}

export const mergePickResults = pickArr => {
  // asis, tobe 객체 배열을 merge
  const result = []
  pickArr.forEach(pick => {
    if (pick.asis) {
      // result에서 monId가 존재하는 인덱스를 찾는다
      let exist = false
      for (let i = 0; i < result.length; i++) {
        if (result[i].tobe.monId === pick.tobe.monId) {
          result[i].tobe = pick.tobe
          exist = true
          break
        }
      }
      if (!exist) result.push(pick)
    } else {
      result.push(pick)
    }
  })
  return result
}

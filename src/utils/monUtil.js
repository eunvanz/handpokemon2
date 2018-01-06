import { RANK } from 'constants/rules'
import collection from 'models/collection'

import _ from 'lodash'
import { fromJS } from 'immutable'

import { MAX_ADD_BY_COLPOINT, MAX_ADD_BY_GRADE } from 'constants/rules'

export const getMonImage = (mon, customIdx) => {
  if (mon.mon && mon.mon[mon.monId]) {
    return mon.mon[mon.monId].monImage.filter(monImage => (customIdx || mon.imageSeq) == monImage.seq)[0]
  } else {
    return mon.monImage[0]
  }
}

const getRandomStat = (stat) => {
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

const getStatRatio = col => {
  const result = {}
  result.hp = col.hp / col.mon[col.monId].hp
  result.power = col.power / col.mon[col.monId].power
  result.armor = col.armor / col.mon[col.monId].armor
  result.sPower = col.sPower / col.mon[col.monId].sPower
  result.sArmor = col.sArmor / col.mon[col.monId].sArmor
  result.dex = col.dex / col.mon[col.monId].dex
  result.height = col.height / col.mon[col.monId].height
  result.weight = col.weight / col.mon[col.monId].weight
  return result
}

export const convertNextMonToCol = (nextMon, evoluteCol) => {
  // 진화할 콜렉션의 능력치 비율만큼 다음 진화체에도 능력치 부여
  const ratioObj = getStatRatio(evoluteCol)
  const hp = _.round(nextMon.hp * ratioObj.hp)
  const power = _.round(nextMon.power * ratioObj.power)
  const armor = _.round(nextMon.armor * ratioObj.armor)
  const sPower = _.round(nextMon.sPower * ratioObj.sPower)
  const sArmor = _.round(nextMon.sArmor * ratioObj.sArmor)
  const dex = _.round(nextMon.dex * ratioObj.dex)
  const total = hp + power + armor + sPower + sArmor + dex
  const height = _.round(nextMon.height * ratioObj.height, 1)
  const weight = _.round(nextMon.weight * ratioObj.weight, 1)
  const col = Object.assign({}, collection, { mon: { [nextMon.id]: nextMon } },
    { hp, power, armor, sPower, sArmor, dex, rank: evoluteCol.rank, monId: nextMon.id, level: 1, total, height, weight, imageSeq: nextMon.monImage[0].seq })
  return col
}

export const levelUpCollection = col => {
  let updateObj = fromJS(col)
  for (let i = 0; i < col.mon[col.monId].point; i++) {
    const idx = _.random(1, 6)

    if (idx === 1) updateObj = updateObj.update('addedHp', val => val + 1)
    else if (idx === 2) updateObj = updateObj.update('addedPower', val => val + 1)
    else if (idx === 3) updateObj = updateObj.update('addedArmor', val => val + 1)
    else if (idx === 4) updateObj = updateObj.update('addedSPower', val => val + 1)
    else if (idx === 5) updateObj = updateObj.update('addedSArmor', val => val + 1)
    else updateObj = updateObj.update('addedDex', val => val + 1)
  }
  updateObj = updateObj.update('level', val => val + 1)
  updateObj = updateObj.update('addedTotal', val => val + col.mon[col.monId].point)
  return updateObj.toJS()
}

export const levelDownCollection = (col, levelToDown) => {
  const updateObj = Object.assign({}, col, { level: col.level - (levelToDown || col.mon[col.monId].evoLv) })
  for (let i = 0; i < col.mon[col.monId].point * (levelToDown || col.mon[col.monId].evoLv); i++) {
    const idx = _.random(0, 5)
    const stat = ['addedHp', 'addedPower', 'addedArmor', 'addedSPower', 'addedSArmor', 'addedDex']
    if (updateObj[stat[idx]] > 0) {
      updateObj[stat[idx]] = updateObj[stat[idx]] - 1
      updateObj.addedTotal -= 1
    } else {
      i = i - 1
    }
  }
  return updateObj
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

export const isMaxLevel = (col, user) => {
  const maxByGrade = MAX_ADD_BY_GRADE[col.mon[col.monId].grade]
  const points = Object.keys(MAX_ADD_BY_COLPOINT)
  let point = points[0]
  for (let i = 0; i < points.length; i++) {
    if (user.colPoint < Number(points[i])) {
      point = points[i]
      break
    }
  }
  const maxByColPoint = MAX_ADD_BY_COLPOINT[point]
  const maxAdd = maxByGrade + maxByColPoint
  if (maxAdd < col.addedTotal + col.mon[col.monId].point) return true
  return false
}

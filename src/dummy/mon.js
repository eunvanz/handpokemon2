import { IMG_BASE_URL } from 'constants/urls'
import { RANK } from 'constants/rules'

import _ from 'lodash'

import { collection as colModel } from './model'

export const getAllMons = [
  {
    id: 1,
    no: 1,
    name: '이상해씨',
    description: '',
    mainAttr: '풀',
    subAttr: '독',
    hp: 45,
    power: 49,
    armor: 49,
    sPower: 65,
    sArmor: 65,
    dex: 45,
    total: 318,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.7,
    weight: 6.9,
    next: 2,
    prev: null,
    evoLv: 4,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/WAl8oGo.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 3
  },
  {
    id: 2,
    no: 2,
    name: '이상해풀',
    description: '',
    mainAttr: '풀',
    subAttr: '독',
    hp: 60,
    power: 62,
    armor: 63,
    sPower: 80,
    sArmor: 80,
    dex: 60,
    total: 405,
    grade: 's',
    skill: '몸통박치기',
    gen: 1,
    height: 1,
    weight: 13,
    next: 3,
    prev: 1,
    evoLv: 5,
    point: 4,
    monImage: [{ url: `${IMG_BASE_URL}/b15K8qV.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 5
  },
  {
    id: 3,
    no: 3,
    name: '이상해꽃',
    description: '',
    mainAttr: '풀',
    subAttr: '독',
    hp: 80,
    power: 82,
    armor: 83,
    sPower: 100,
    sArmor: 100,
    dex: 80,
    total: 525,
    grade: 's',
    skill: '몸통박치기',
    gen: 1,
    height: 2.4,
    weight: 155,
    next: 0,
    prev: 2,
    evoLv: 0,
    point: 20,
    monImage: [{ url: `${IMG_BASE_URL}/ThhSEoX.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 7
  },
  {
    id: 4,
    no: 4,
    name: '파이리',
    description: '',
    mainAttr: '불꽃',
    subAttr: null,
    hp: 39,
    power: 52,
    armor: 43,
    sPower: 60,
    sArmor: 50,
    dex: 65,
    total: 309,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.6,
    weight: 8.5,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/dc3peHM.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 3
  },
  {
    id: 7,
    no: 7,
    name: '꼬부기',
    description: '',
    mainAttr: '물',
    subAttr: null,
    hp: 44,
    power: 48,
    armor: 65,
    sPower: 50,
    sArmor: 64,
    dex: 43,
    total: 314,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.5,
    weight: 9,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/wwt23WF.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 3
  },
  {
    id: 10,
    no: 10,
    name: '캐터피',
    description: '',
    mainAttr: '벌레',
    subAttr: null,
    hp: 45,
    power: 30,
    armor: 35,
    sPower: 20,
    sArmor: 20,
    dex: 45,
    total: 195,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.3,
    weight: 2.9,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/fd9XbFZ.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 1
  },
  {
    id: 13,
    no: 13,
    name: '뿔충이',
    description: '',
    mainAttr: '벌레',
    subAttr: '독',
    hp: 40,
    power: 35,
    armor: 30,
    sPower: 20,
    sArmor: 20,
    dex: 50,
    total: 195,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.3,
    weight: 3.2,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/xxP9ULR.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 1
  },
  {
    id: 16,
    no: 16,
    name: '구구',
    description: '',
    mainAttr: '노말',
    subAttr: '비행',
    hp: 40,
    power: 45,
    armor: 40,
    sPower: 35,
    sArmor: 35,
    dex: 56,
    total: 251,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.3,
    weight: 1.8,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/EqNmv4E.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 2
  },
  {
    id: 19,
    no: 19,
    name: '꼬렛',
    description: '',
    mainAttr: '노말',
    subAttr: null,
    hp: 30,
    power: 56,
    armor: 35,
    sPower: 25,
    sArmor: 35,
    dex: 72,
    total: 253,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.3,
    weight: 3.5,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/ubbz5OP.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 2
  },
  {
    id: 21,
    no: 21,
    name: '깨비참',
    description: '',
    mainAttr: '노말',
    subAttr: '비행',
    hp: 40,
    power: 60,
    armor: 30,
    sPower: 31,
    sArmor: 31,
    dex: 70,
    total: 262,
    grade: 'b',
    skill: '몸통박치기',
    gen: 1,
    height: 0.3,
    weight: 2,
    next: 0,
    prev: 0,
    evoLv: 0,
    point: 1,
    monImage: [{ url: `${IMG_BASE_URL}/J9l2OOc.png`, seq: 1, designer: { nickname: '웅이' } }],
    cost: 2
  }
]

export const getMonsByGrade = grade => getAllMons.filter(mon => mon.grade === grade)

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
  const col = Object.assign({}, colModel, { mon },
    { hp, power, armor, sPower, sArmor, dex, rank, monId: mon.id, level: 1, total, height, weight })
  return col
}

export const getStartPick = () => {
  const basicMons = getMonsByGrade('b')
  const idxSet = new Set()
  const qtyToPick = 3
  while (idxSet.size < qtyToPick) {
    const idx = Math.floor(Math.random() * basicMons.length)
    idxSet.add(idx)
  }
  return _.shuffle(basicMons.filter((mon, idx) => idxSet.has(idx)).map(mon => convertMonToCol(mon)))
}

export const getPicks = (attrs, grades) => {
  let picks = getAllMons.filter(mon => {
    return _.includes(grades, mon.grade) && _.includes(attrs, mon.mainAttr)
  })
  const takedPick = _.take(_.shuffle(picks), 5)
  return takedPick.map(pick => convertMonToCol(pick))
}

export const getNextMon = mon => {
  return getAllMons.filter(evmon => evmon.id === mon.next)
}

export const getById = id => getAllMons.filter(mon => mon.id === id)[0]

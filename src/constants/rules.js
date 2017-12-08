const RANK_UNIT = 0.06

export const RANK = {
  SS: {
    chance: 7,
    range: { min: 1.01 + RANK_UNIT * 3, max: 1 + RANK_UNIT * 4 }
  },
  S: {
    chance: 13,
    range: { min: 1.01 + RANK_UNIT * 2, max: 1 + RANK_UNIT * 3 }
  },
  A: {
    chance: 15,
    range: { min: 1.01 + RANK_UNIT * 1, max: 1 + RANK_UNIT * 2 }
  },
  B: {
    chance: 15,
    range: { min: 1.01, max: 1 + RANK_UNIT * 1 }
  },
  C: {
    chance: 20,
    range: { min: 1.01 - RANK_UNIT, max: 1 }
  },
  D: {
    chance: 10,
    range: { min: 1.01 - RANK_UNIT * 2, max: 1 - RANK_UNIT }
  },
  E: {
    chance: 10,
    range: { min: 1.01 - RANK_UNIT * 3, max: 1 - RANK_UNIT * 2 }
  },
  F: {
    chance: 10,
    range: { min: 1.01 - RANK_UNIT * 4, max: 1 - RANK_UNIT * 3 }
  }
}

export const PICK_MON_ROULETTE_DELAY = 10000

export const PICK_CREDIT_REFRESH = 20 * 60 * 1000
export const BATTLE_CREDIT_REFRESH = 20 * 60 * 1000
export const ADVENTURE_CREDIT_REFRESH = 60 * 60 * 1000

export const MAX_PICK_CREDIT = 12
export const MAX_BATTLE_CREDIT = 12
export const MAX_ADVENTURE_CREDIT = 10

export const getMixGrades = (mixCols) => {
  if (mixCols[0].mon[mixCols[0].monId].grade === mixCols[1].mon[mixCols[1].monId].grade &&
    mixCols[0].mon[mixCols[0].monId].grade === 'r') {
    return ['b', 'r', 'e']
  } else if (mixCols[0].mon[mixCols[0].monId].grade === mixCols[1].mon[mixCols[1].monId].grade &&
    mixCols[0].mon[mixCols[0].monId].grade === 'e') {
    return ['r', 'e', 'l']
  } else if (mixCols[0].mon[mixCols[0].monId].grade === mixCols[1].mon[mixCols[1].monId].grade &&
    mixCols[0].mon[mixCols[0].monId].grade === 'l') {
    return ['l']
  } else {
    return ['b', 'r']
  }
}

export const getStandardCost = (grade, total) => {
  let base = [180, 228, 276, 324, 372, 420, 468, 516, 564, 612, 660]
  if (grade === 'r' || grade === 'sr') {
    base = base.map(elem => elem + 20)
  } else if (grade === 'e') {
    base = base.map(elem => elem + 40)
  } else if (grade === 'l') {
    base = base.map(elem => elem + 60)
  }
  for (let i = 0; i < base.length; i++) {
    if (total <= base[i]) return i
  }
  return 10
}

export const LEAGUE = [
  {
    name: '걸음마',
    maxCost: 11,
    cut: 90
  },
  {
    name: '브론즈',
    maxCost: 12,
    cut: 80
  },
  {
    name: '실버',
    maxCost: 13,
    cut: 70
  },
  {
    name: '골드',
    maxCost: 14,
    cut: 60
  },
  {
    name: '다이아',
    maxCost: 16,
    cut: 50
  },
  {
    name: '에이스',
    maxCost: 18,
    cut: 40
  },
  {
    name: '챔피온',
    maxCost: 20,
    cut: 30
  },
  {
    name: '마스터',
    maxCost: 22,
    cut: 20
  },
  {
    name: '레전드',
    maxCost: 24,
    cut: 10
  }
]

export const ATTR_IDX = ['노말', '불꽃', '물', '전기', '풀', '얼음', '격투', '독', '땅',
  '비행', '염력', '벌레', '바위', '유령', '용', '악', '강철', '요정']

export const ATTR_MATCH = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.8, 0.6, 1, 1, 0.8, 1],
  [1, 0.8, 0.8, 1, 1.4, 1.4, 1, 1, 1, 1, 1, 1.4, 0.8, 1, 0.8, 1, 1.4, 1],
  [1, 1.4, 0.8, 1, 0.8, 1, 1, 1, 1.4, 1, 1, 1, 1.4, 1, 0.8, 1, 1, 1],
  [1, 1, 1.4, 0.8, 0.8, 1, 1, 1, 0.6, 1.4, 1, 1, 1, 1, 0.8, 1, 1, 1],
  [1, 0.8, 1.4, 1, 0.8, 1, 1, 0.8, 1.4, 0.8, 1, 0.8, 1.4, 1, 0.8, 1, 0.8, 1],
  [1, 0.8, 0.8, 1, 1.4, 0.8, 1, 1, 1.4, 1.4, 1, 1, 1, 1, 1.4, 1, 0.8, 1],
  [1.4, 1, 1, 1, 1, 1.4, 1, 0.8, 1, 0.8, 0.8, 0.8, 1.4, 0.6, 1, 1.4, 1.4, 0.8],
  [1, 1, 1, 1, 1.4, 1, 1, 0.8, 0.8, 1, 1, 1, 0.8, 0.8, 1, 1, 0.6, 1.4],
  [1, 1.4, 1, 1.4, 0.8, 1, 1, 1.4, 1, 0.6, 1, 0.8, 1.4, 1, 1, 1, 1.4, 1],
  [1, 1, 1, 0.8, 1.4, 1, 1.4, 1, 1, 1, 1, 1.4, 0.8, 1, 1, 1, 0.8, 1],
  [1, 1, 1, 1, 1, 1, 1.4, 1.4, 1, 1, 0.8, 1, 1, 1, 1, 0.6, 0.8, 1],
  [1, 0.8, 1, 1, 1.4, 1, 0.8, 0.8, 1, 0.8, 1.4, 1, 1, 0.8, 1, 1.4, 0.8, 0.8],
  [1, 1.4, 1, 1, 1, 1.4, 0.8, 1, 0.8, 1.4, 1, 1.4, 1, 1, 1, 1, 0.8, 1],
  [0.6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4, 1, 1, 1.4, 1, 0.8, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4, 1, 0.8, 0.6],
  [1, 1, 1, 1, 1, 1, 0.8, 1, 1, 1, 1.4, 1, 1, 1.4, 1, 0.8, 1, 0.8],
  [1, 0.8, 0.8, 0.8, 1, 1.4, 1, 1, 1, 1, 1, 1, 1.4, 1, 1, 1, 0.8, 1],
  [1, 0.8, 1, 1, 1, 1, 1.4, 0.8, 1, 1, 1, 1, 1, 1, 1.4, 1.4, 0.8, 1]
]

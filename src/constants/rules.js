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

export const PICK_CREDIT_REFRESH = 30 * 1000
export const BATTLE_CREDIT_REFRESH = 20 * 60 * 1000
export const ADVENTURE_CREDIT_REFRESH = 60 * 60 * 1000

export const MAX_PICK_CREDIT = 12
export const MAX_BATTLE_CREDIT = 12
export const MAX_ADVENTURE_CREDIT = 10

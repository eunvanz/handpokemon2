import _ from 'lodash'
import numeral from 'numeral'

import { ATTR_MATCH, ATTR_IDX } from 'constants/rules'

import { deepCopyArray } from 'utils/commonUtil'

export default class Battle {
  constructor (userPicks, enemyPicks, firstAttacker) {
    this.firstAttacker = firstAttacker
    this.userPicks = userPicks
    this.enemyPicks = enemyPicks
    this.attacker = firstAttacker === 'user' ? 'enemy' : 'user'
    this.defender = firstAttacker
    this.turn = 0
    this.mom = null
    this.isFinished = false
    this.winner = null
    this._generateBattleLog = this._generateBattleLog.bind(this)
    this._proceedNextTurn = this._proceedNextTurn.bind(this)
  }
  _generateBattleLog () {
    const log = { turns: [] }
    log.userPicks = deepCopyArray(this.userPicks)
    console.log('log.userPicks', log.userPicks)
    log.enemyPicks = deepCopyArray(this.enemyPicks)
    while (!this.isFinished) {
      log.turns.push(this._proceedNextTurn())
    }
    log.mom = this._getMonOfTheMatch(log.turns)
    log.isGandang = this._isGandang()
    log.isOneMonShow = this._isOneMonShow()
    log.isPerfectGame = this._isPerfectGame()
    log.isUnderDog = this._isUnderDog()
    log.isFirstDefense = this._isFirstDefense()
    log.winner = this.winner
    return log
  }
  _isUnderDog () {
    if (this.winner !== 'user') return false
    const userTotal = this.userPicks.reduce((total, pick) => total + pick.totalAbility, 0)
    const enemyTotal = this.enemyPicks.reduce((total, pick) => total + pick.totalAbility, 0)
    return userTotal < enemyTotal
  }
  _isPerfectGame () {
    if (this.winner !== 'user') return false
    return this.userPicks.filter(pick => pick.restHp > 0).length === 3
  }
  _isOneMonShow () {
    if (this.winner !== 'user') return false
    return this.userPicks.filter(pick => pick.kills === 3).length > 0
  }
  _isGandang () {
    if (this.winner !== 'user') return false
    return this.userPicks.reduce((totalRestHp, pick) => totalRestHp + pick.restHp, 0) <= 30
  }
  _isFirstDefense () {
    if (this.winner !== 'user') return false
    return this.firstAttacker !== 'user'
  }
  _getMonOfTheMatch (turns) {
    const lastTurn = turns[turns.length - 1]
    let mom
    let highestPoint = 0
    lastTurn.attackerPicks.forEach(pick => {
      if (pick.point > highestPoint) {
        mom = pick
        highestPoint = pick.point
      }
    })
    lastTurn.defenderPicks.forEach(pick => {
      if (pick.point > highestPoint) {
        mom = pick
        highestPoint = pick.point
      }
    })
    return mom
  }
  _proceedNextTurn () {
    this.attacker = this.attacker === 'user' ? 'enemy' : 'user'
    this.defender = this.defender === 'user' ? 'enemy' : 'user'
    this.turn++
    const attackerPicks = this.attacker === 'user' ? this.userPicks : this.enemyPicks
    const defenderPicks = this.attacker === 'user' ? this.enemyPicks : this.userPicks
    const attackerIdx = this._pickIdx(this.attacker)
    const attackerPick = attackerPicks[attackerIdx]
    const defenderIdx = this._pickIdx(this.defender)
    const defenderPick = defenderPicks[defenderIdx]
    const attackType = _.random(0, 2) // 0, 1 - 일반, 2 - 특수
    const beforeHp = defenderPick.restHp
    const pureDamage = attackType === 2 ? this._getSpecialDamage(attackerPick, defenderPick) : this._getBasicDamage(attackerPick, defenderPick)
    const attrBonus = numeral(this._getAttrMatchAdjustedVar(attackerPick, defenderPick) - 1).format('0%')
    // console.log('attrBonus', attrBonus)
    const isAvoid = this._isAvoid(attackerPick, defenderPick)
    let finalDamage = 0
    let afterHp = beforeHp
    if (isAvoid) {
      defenderPick.point += pureDamage
    } else {
      finalDamage = this._getFinalDamage(attackType, pureDamage, defenderPick)
      afterHp -= finalDamage
      afterHp = afterHp < 0 ? 0 : afterHp
      if (afterHp === 0) attackerPick.kills++
      defenderPick.restHp = afterHp
      attackerPick.point += afterHp === 0 ? beforeHp : pureDamage
      defenderPick.point += pureDamage
    }
    if (this._areAllDead(defenderPicks)) {
      this.isFinished = true
      this.winner = this.attacker
    }
    const result = {
      attacker: this.attacker,
      defender: this.defender,
      turn: this.turn,
      attackerPicks: deepCopyArray(attackerPicks),
      defenderPicks: deepCopyArray(defenderPicks),
      attackerIdx,
      attackerPick: Object.assign({}, attackerPick),
      defenderIdx,
      defenderPick: Object.assign({}, defenderPick),
      attackType,
      beforeHp,
      pureDamage,
      finalDamage,
      attrBonus,
      afterHp,
      isAvoid,
      isFinished: this.isFinished
    }
    return result
  }
  _pickIdx (srcName) {
    const srcPicks = srcName === 'user' ? this.userPicks : this.enemyPicks
    let idx = 1
    while (true) {
      idx = _.random(0, 2)
      if (srcPicks[idx].restHp > 0) break
    }
    return idx
  }
  _getBasicDamage (attackMon, defenseMon) {
    const attackRange = Math.floor(Math.random() * 10) * 0.1 + 1.5
    return Math.round((attackMon.adjPower * attackRange +
      attackMon.adjDex * 0.1 * attackRange) *
      this._getAttrMatchAdjustedVar(attackMon, defenseMon))
  }
  _getFinalDamage (attackType, pureDamage, defenderPick) {
    let armor = defenderPick.adjArmor
    if (attackType === 2) armor = defenderPick.adjSArmor
    return Math.round(pureDamage - pureDamage * this._getArmorPct(armor, defenderPick.adjDex))
  }
  _getArmorPct (armor, dex) {
    let pct = 0.001 + armor * 0.003 + dex * 0.0005
    if (pct > 0.8) pct = 0.8
    // TODO: 완벽방어 확률 추가
    return pct
  }
  _getSpecialDamage (attackMon, defenseMon) {
    const specialRange = Math.floor(Math.random() * 20) * 0.1 + 3.5
    return Math.round((attackMon.adjSPower * specialRange +
      attackMon.adjDex * 0.1 * specialRange) *
      this._getAttrMatchAdjustedVar(attackMon, defenseMon))
  }
  _getAttrMatchAdjustedVar (attackerPick, defenderPick) {
    const srcCollection = attackerPick.col
    const tgtCollection = defenderPick.col
    const srcMainAttr = srcCollection.mon[srcCollection.monId].mainAttr
    const srcSubAttr = srcCollection.mon[srcCollection.monId].subAttr
    const tgtMainAttr = tgtCollection.mon[tgtCollection.monId].mainAttr
    const tgtSubAttr = tgtCollection.mon[tgtCollection.monId].subAttr
    const srcMainAttrIdx = ATTR_IDX.indexOf(srcMainAttr)
    const srcSubAttrIdx = ATTR_IDX.indexOf(srcSubAttr)
    const tgtMainAttrIdx = ATTR_IDX.indexOf(tgtMainAttr)
    const tgtSubAttrIdx = ATTR_IDX.indexOf(tgtSubAttr)
    let result = 1
    result = ATTR_MATCH[srcMainAttrIdx][tgtMainAttrIdx]
    if (tgtSubAttrIdx !== -1) result = result * ATTR_MATCH[srcMainAttrIdx][tgtSubAttrIdx]
    if (srcSubAttrIdx !== -1) {
      result = result * ATTR_MATCH[srcSubAttrIdx][tgtMainAttrIdx]
      if (tgtSubAttrIdx !== -1) result = result * ATTR_MATCH[srcSubAttrIdx][tgtSubAttrIdx]
    }
    // console.log('srcMainAttr', srcMainAttr)
    // console.log('srcSubAttr', srcSubAttr)
    // console.log('tgtMainAttr', tgtMainAttr)
    // console.log('tgtSubAttr', tgtSubAttr)
    // console.log('attrVar', result)
    return result
  }
  _areAllDead (picks) {
    const totalRestHp = picks.reduce((accm, pick) => {
      return accm + pick.restHp
    }, 0)
    return totalRestHp === 0
  }
  _isAvoid (attackerPick, defenderPick) {
    const avoidIdx = Math.floor(Math.random() * 100) + 1
    let point = Math.floor(defenderPick.adjDex * 0.25 - attackerPick.adjDex * 0.15)
    if (point < 5) {
      point = 5
    } else if (point > 60) {
      point = 60
    }
    return avoidIdx <= point
  }
}

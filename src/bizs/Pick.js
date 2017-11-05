class Pick {
  constructor (col, user) {
    this.col = col
    this.hp = (col.hp + col.addedHp +
      user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[0] : 0) : 0 +
        user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[0].burf[0] : 0) : 0)
    this.power = (col.power + col.addedPower +
      user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[1] : 0) : 0 +
        user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[0].burf[1] : 0) : 0)
    this.armor = (col.armor + col.addedArmor +
      user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[2] : 0) : 0 +
        user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[0].burf[2] : 0) : 0)
    this.specialPower = (col.specialPower + col.addedSpecialPower +
      user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[3] : 0) : 0 +
        user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[0].burf[3] : 0) : 0)
    this.specialArmor = (col.specialArmor + col.addedSpecialArmor +
      user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[4] : 0) : 0 +
        user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[0].burf[4] : 0) : 0)
    this.dex = (col.dex + col.addedDex +
      user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[5] : 0) : 0 +
        user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[0].burf[5] : 0) : 0)
    this.adjHp = this.hp
    this.adjPower = this.power
    this.adjArmor = this.armor
    this.adjSpecialPower = this.specialPower
    this.adjSpecialArmor = this.specialArmor
    this.adjDex = this.dex
    this.totalHp = this.hp * 4 + 360
    this.restHp = this.totalHp
    this.battlePoint = 0
    this.col = col
    this.user = user
    this.kills = 0
    this.totalAbility = this.hp + this.power + this.armor + this.specialPower + this.specialArmor + this.dex
  }
}

export default Pick

class Pick {
  constructor (col, user) {
    this.col = col
    this.hp = (col.hp + col.addedHp +
      (user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[0] : 0) : 0) +
        (user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[1].burf[0] : 0) : 0))
    this.power = (col.power + col.addedPower +
      (user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[1] : 0) : 0) +
        (user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[1].burf[1] : 0) : 0))
    this.armor = (col.armor + col.addedArmor +
      (user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[2] : 0) : 0) +
        (user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[1].burf[2] : 0) : 0))
    this.sPower = (col.sPower + col.addedSPower +
      (user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[3] : 0) : 0) +
        (user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[1].burf[3] : 0) : 0))
    this.sArmor = (col.sArmor + col.addedSArmor +
      (user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[4] : 0) : 0) +
        (user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[1].burf[4] : 0) : 0))
    this.dex = (col.dex + col.addedDex +
      (user.enabledHonors ? (user.enabledHonors[0] ? user.enabledHonors[0].burf[5] : 0) : 0) +
        (user.enabledHonors ? (user.enabledHonors[1] ? user.enabledHonors[1].burf[5] : 0) : 0))
    this.adjHp = this.hp
    this.adjPower = this.power
    this.adjArmor = this.armor
    this.adjSPower = this.sPower
    this.adjSArmor = this.sArmor
    this.adjDex = this.dex
    this.totalHp = this.hp * 4 + 300
    this.restHp = this.totalHp
    this.battlePoint = 0
    this.col = col
    this.user = user
    this.kills = 0
    this.totalAbility = this.hp + this.power + this.armor + this.sPower + this.sArmor + this.dex
    this.point = 0
  }
}

export default Pick

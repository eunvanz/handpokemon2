class Pick {
  constructor (col, user) {
    this.col = col
    this.hp = (col.hp + col.addedHp)
  }
}

export default Pick

export default class User {
  constructor () {
    this.regDate = new Date().toISOString()
    this.email = ''
    this.nickname = ''
    this.introduce = ''
    this.profileImage = ''
    this.profileImageThumbnail = ''
    this.colPoint = 0
    this.colRank = 1
    this.leaguePoint = 1000
    this.leagueRank = 1
    this.trainerGrade = null
    this.trainerAttr = null
    this.pickCredit = 12
    this.battleCredit = 12
    this.adventureCredit = 10
    this.lastPick = 0
    this.lastLeague = 0
    this.lastAdventure = 0
    this.pokemoney = 0
  }
}

import keygen from 'keygenerator'

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
    this.battleWin = 0
    this.battleLose = 0
    this.colPoint_leaguePoint = '0000000000_0000001000'
    this.leaguePoint_colPoint = '0000001000_0000000000'
    this.league = 0
    this.attackWin = 0
    this.attackLose = 0
    this.defenseWin = 0
    this.defenseLose = 0
    this.winInRow = 0
    this.battleSpeed = 5
    this.inventory = []
    this.maxWinInRow = 0
    this.recommenderCode = keygen.password()
    this.isSocialAccount = false
    this.stage = 1
  }
}

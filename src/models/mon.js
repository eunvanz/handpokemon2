export default class Mon {
  constructor () {
    this.no = 0
    this.name = { ko: '' }
    this.description = { ko: '' }
    this.mainAttr = null
    this.subAttr = null
    this.hp = 0
    this.power = 0
    this.armor = 0
    this.sPower = 0
    this.sArmor = 0
    this.dex = 0
    this.total = 0
    this.grade = ''
    this.skill = { ko: '' }
    this.generation = 0
    this.height = 0
    this.weight = 0
    this.next = null // 배열
    this.prev = null
    this.evoLv = null
    this.point = 0
    this.monImage = [
      {
        fullPath: '',
        url: '',
        seq: 0,
        designer: ''
      }
    ]
    this.cost = 0
    this.requiredLv = 0
  }
}

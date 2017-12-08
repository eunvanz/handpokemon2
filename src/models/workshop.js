export default class Workshop {
  constructor () {
    this.designer = ''
    this.name = ''
    this.img = ''
    this.likes = 0
    this.isAdopted = false
    this.whoLikes = []
    this.regDate = new Date().toDateString()
    this.designerUid = ''
  }
}

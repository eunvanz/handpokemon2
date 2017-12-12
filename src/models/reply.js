export default class reply {
  constructor () {
    this.id = ''
    this.writer = {}
    this.content = ''
    this.regDate = new Date().toISOString()
    this.modDate = new Date().toISOString()
  }
}

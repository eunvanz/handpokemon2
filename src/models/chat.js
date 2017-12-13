export default class Chat {
  constructor () {
    this.writer = {}
    this.content = ''
    this.channel = 'global'
    this.regDate = new Date().toISOString()
  }
}

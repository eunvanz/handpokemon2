export default class Board {
  constructor () {
    this.writer = {}
    this.category = ''
    this.content = {}
    this.regDate = new Date().toISOString()
    this.modDate = new Date().toISOString()
    this.replies = []
    this.likes = 0
    this.answers = []
    this.whoLikes = []
    this.title = []
    this.views = 0
    this.preview = ''
  }
}

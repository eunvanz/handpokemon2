import { without, reverse } from 'lodash'

export const postBoard = (firebase, board) => {
  const id = firebase.ref(`boards/${board.category}`).push().key
  board.id = id
  return firebase.ref(`boards/${board.category}/${id}`).update(board)
    .then(() => Promise.resolve(board))
}

export const postReply = (firebase, reply, board) => {
  const id = firebase.ref(`boards/${board.category}/${board.id}/replies`).push().key
  reply.id = id
  return firebase.ref(`boards/${board.category}/${board.id}/replies/${id}`).update(reply)
  .then(() => Promise.resolve(reply))
}

export const updateBoard = (firebase, board) => {
  const updateObj = {
    [`boards/${board.category}/${board.id}/title`]: board.title,
    [`boards/${board.category}/${board.id}/content`]: board.content,
    [`boards/${board.category}/${board.id}/modDate`]: new Date().toISOString()
  }
  return firebase.ref().update(updateObj)
}

export const setBoardUserProfile = (firebase, profilePath, userId) => {
  const userRef = firebase.ref(`users/${userId}/profileImage`)
  return userRef.once('value')
  .then(snapshot => {
    const newProfileImage = snapshot.val()
    return firebase.ref(`${profilePath}`).set(newProfileImage).then(() => Promise.resolve(newProfileImage))
  })
}

export const updateLikes = (firebase, board, num) => {
  const ref = firebase.ref(`boards/${board.category}/${board.id}/likes`)
  return ref.transaction(likes => {
    return likes + num
  })
}

export const updateWhoLikes = (firebase, board, userId, type) => {
  const ref = firebase.ref(`boards/${board.category}/${board.id}/whoLikes`)
  return ref.transaction(whoLikes => {
    let newWhoLikes = whoLikes || []
    if (type === 'push') {
      newWhoLikes.push(userId)
    } else if (type === 'remove') {
      newWhoLikes = without(newWhoLikes, userId)
    }
    return newWhoLikes
  })
}

export const increaseViews = (firebase, board) => {
  const ref = firebase.ref(`boards/${board.category}/${board.id}/views`)
  return ref.transaction(views => {
    return views + 1
  })
}

export const getBoardList = (firebase, category, page, prevRegDate, prevKey) => {
  let limitToLast = page * 5
  const orderByChild = 'regDate'
  let ref = firebase.ref(`boards/${category}`).orderByChild(orderByChild)
  if (prevRegDate && prevKey) {
    ref = ref.endAt(prevRegDate, prevKey)
    limitToLast++ // 이 전 페이지의 마지막 아이템까지 포함하므로 limit를 1 추가
  }
  return ref.limitToLast(limitToLast).once('value')
    .then(snapshot => {
      const result = []
      snapshot.forEach(child => {
        const board = child.val()
        board.id = child.key
        result.push(board)
      })
      return Promise.resolve(reverse(result.slice(prevKey ? 0 : undefined, prevKey ? -1 : undefined)))
    })
}

export const getBoard = (firebase, category, id) => {
  const ref = firebase.ref(`boards/${category}/${id}`)
  return ref.once('value').then(snapshot => snapshot.val())
}

export const deleteBoard = (firebase, board) => {
  return firebase.remove(`boards/${board.category}/${board.id}`)
}

export const deleteReply = (firebase, reply, board) => {
  return firebase.remove(`boards/${board.category}/${board.id}/replies/${reply.id}`)
}

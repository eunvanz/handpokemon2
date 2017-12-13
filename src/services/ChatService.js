export const postChat = (firebase, chat) => {
  const ref = firebase.ref(`chats/${chat.channel}`)
  const id = ref.push().key
  chat.id = id
  return firebase.ref(`chats/${chat.channel}/${id}`).update(chat)
    .then(() => {
      return ref.once('value')
      .then(snapshot => {
        const keys = Object.keys(snapshot.val())
        if (keys.length > 30) {
          const keyToDelete = keys[0]
          return firebase.remove(`chats/${chat.channel}/${keyToDelete}`)
        }
        return Promise.resolve()
      })
    })
}

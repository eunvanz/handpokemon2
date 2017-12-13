export const postChat = (firebase, chat) => {
  const ref = firebase.ref(`chats/${chat.channel}`)
  const id = ref.push().key
  chat.id = id
  return firebase.ref(`chats/${chat.channel}/${id}`).update(chat)
    .then(() => {
      return ref.orderByChild('regDate').once('value')
      .then(snapshot => {
        if (snapshot.length > 30) {
          const keyToDelete = snapshot[0].key
          return firebase.remove(`chats/${chat.channel}/${keyToDelete}`)
        }
        return Promise.resolve()
      })
    })
}

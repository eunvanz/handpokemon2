export const clearLucky = (firebase) => {
  const ref = firebase.ref(`luckies`)
  return ref.once('value')
  .then(snapshot => {
    const keys = Object.keys(snapshot.val())
    console.log('keys', keys)
    for (let i = 0; i < keys.length - 3; i++) {
      firebase.remove(`luckies/${keys[i]}`)
    }
    return Promise.resolve()
  })
}

export const postLucky = (firebase, lucky) => {
  const ref = firebase.ref(`luckies`)
  const id = ref.push().key
  lucky.id = id
  return firebase.ref(`luckies/${id}`).update(lucky)
    .then(() => {
      return ref.once('value')
        .then(snapshot => {
          const keys = Object.keys(snapshot.val())
          if (keys.length > 3) {
            const keyToDelete = keys[0]
            return firebase.remove(`luckies/${keyToDelete}`)
          }
          return Promise.resolve()
        })
    })
}


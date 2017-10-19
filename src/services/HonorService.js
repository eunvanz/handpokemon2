export const postHonor = (firebase, honor) => {
  const id = firebase.ref('honors').push().key
  honor.id = id
  return firebase.ref(`honors/${id}`).update(honor)
    .then(() => Promise.resolve(honor))
}

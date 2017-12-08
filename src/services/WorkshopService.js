import { without } from 'lodash'

export const postWorkshop = (firebase, workshop) => {
  const id = firebase.ref('works').push().key
  workshop.id = id
  return firebase.ref(`works/${id}`).update(workshop)
  .then(() => Promise.resolve(workshop))
}

export const updateLikes = (firebase, id, num) => {
  const workRef = firebase.ref(`works/${id}/likes`)
  return workRef.transaction(likes => {
    return likes + num
  })
}

export const updateWhoLikes = (firebase, id, userId, type) => {
  const workRef = firebase.ref(`works/${id}/whoLikes`)
  return workRef.transaction(whoLikes => {
    let newWhoLikes = whoLikes || []
    if (type === 'push') {
      newWhoLikes.push(userId)
    } else if (type === 'remove') {
      newWhoLikes = without(newWhoLikes, userId)
    }
    return newWhoLikes
  })
}

export const updateWorkshop = (firebase, workshop) => {
  const workRef = firebase.ref(`works/${workshop.id}`)
  return workRef.set(workshop)
}

export const deleteWorkshop = (firebase, workshop) => {
  const workRef = firebase.ref(`works/${workshop.id}`)
  return workRef.set(null)
}

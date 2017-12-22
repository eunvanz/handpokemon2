export const postTempMon = (firebase, mon) => {
  const id = firebase.ref('tempMons').push().key
  mon.id = id
  return firebase.ref(`tempMons/${id}`).update(mon)
    .then(() => Promise.resolve(mon))
}

export const getTempMonByNo = (firebase, no) => {
  return firebase.ref(`tempMons`).orderByChild('no').equalTo(no).once('value').then(snapshot => snapshot.val())
}

export const getTempMonById = (firebase, monId) => {
  return firebase.ref(`tempMons/${monId}`).once('value').then(snapshot => snapshot.val())
}

export const updateTempMon = (firebase, mon) => {
  return firebase.ref(`tempMons/${mon.id}`).set(mon)
}

export const deleteTempMon = (firebase, monId) => {
  return firebase.remove(`tempMons/${monId}`)
}

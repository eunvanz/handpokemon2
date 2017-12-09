export const postStage = (firebase, stage) => {
  const id = firebase.ref('stages').push().key
  stage.id = id
  return firebase.ref(`stages/${id}`).update(stage)
    .then(() => Promise.resolve(stage))
}

export const deleteStage = (firebase, stageId) => {
  return firebase.remove(`stages/${stageId}`)
}

export const updateStage = (firebase, stageId, stage) => {
  const ref = firebase.ref(`stages/${stageId}`)
  return ref.set(stage)
}

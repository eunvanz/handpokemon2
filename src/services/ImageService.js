export const postMonImage = (firebase, storagePath, imageFiles, withThumbnail) => {
  const ref = firebase.storage().ref(storagePath)
  const dbRef = firebase.ref('monImages')
  dbRef.once('value')
  .then(snapshot => {
    snapshot.forEach(snap => {
      const filename = snap.val().name
      ref.child(`${filename}`).updateMetadata({ cacheControl: 'max-age=1296000' })
    })
  })
  return Promise.all(imageFiles.map(imageFile => ref.child(`${imageFile.filename}`).put(imageFile, { cacheControl: 'max-age=1296000' })))
}

export const postImage = (firebase, storagePath, imageFiles, setMaxAge) => {
  return firebase.uploadFiles(storagePath, imageFiles, storagePath)
  .then(res => {
    if (setMaxAge) {
      return firebase.storage().ref(res[0].File.fullPath).updateMetadata({ cacheControl: 'max-age=1296000' })
      .then(res2 => {
        return Promise.resolve(res)
      })
    } else {
      return Promise.resolve(res)
    }
  })
}

export const deleteImage = (firebase, path, dbPath) => {
  return firebase.deleteFile(path, dbPath)
}

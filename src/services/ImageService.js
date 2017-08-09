export const postImage = (firebase, storagePath, imageFiles) => {
  return firebase.uploadFiles(storagePath, imageFiles, storagePath)
}

export const deleteImage = (firebase, path) => {
  return firebase.deleteFile(path, path)
}

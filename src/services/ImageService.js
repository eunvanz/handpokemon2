export const postImage = (firebase, storagePath, imageFiles, withThumbnail) => {
  return firebase.uploadFiles(storagePath, imageFiles, storagePath)
}

export const deleteImage = (firebase, path) => {
  return firebase.deleteFile(path, path)
}

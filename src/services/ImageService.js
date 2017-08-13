export const postImage = (firebase, storagePath, imageFiles) => {
  return firebase.uploadFiles(storagePath, imageFiles, storagePath)
}

export const postImageWithThumbnail = (firebase, storagePath, imageFiles) => {
  return firebase.uploadFiles(storagePath, imageFiles, storagePath)
  .then(res => {
    const srcPath = res[0].File.downloadURL
    // TODO 썸네일 생성하는 작업
  })
}

export const deleteImage = (firebase, path) => {
  return firebase.deleteFile(path, path)
}

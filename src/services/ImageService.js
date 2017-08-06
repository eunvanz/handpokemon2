export const postImage = (fb, storagePath, imageFiles) => {
  return fb.uploadFiles(storagePath, imageFiles, storagePath)
}

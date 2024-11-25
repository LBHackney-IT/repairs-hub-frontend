const fileUploadStatusLogger = (
  totalFiles: number,
  logCallback: (message: string) => void
) => {
  // initiate upload
  logCallback(`Uploading ${totalFiles} file(s)`)

  let numberOfCompletedUploads = 0

  // increment total each time an upload is completed
  const fileUploadCompleteCallback = () => {
    numberOfCompletedUploads++
    logCallback(`${numberOfCompletedUploads} of ${totalFiles} file(s) uploaded`)
  }

  return fileUploadCompleteCallback
}

export default fileUploadStatusLogger

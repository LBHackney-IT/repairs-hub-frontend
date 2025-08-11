const fileUploadStatusLogger = (
  totalFiles: number,
  logCallback: (message: string) => void
) => {
  // initiate upload
  logCallback(`Processing ${totalFiles} file(s)`)

  let numberOfCompletedCompressions = 0
  let numberOfCompletedUploads = 0

  // increment total each time an upload is completed
  const fileUploadCompleteCallback = (action: 'Upload' | 'Compress') => {
    if (action == 'Compress') numberOfCompletedCompressions++
    if (action == 'Upload') numberOfCompletedUploads++
    const compressionIsInProgress =
      numberOfCompletedUploads == 0 &&
      numberOfCompletedCompressions < totalFiles
    if (compressionIsInProgress)
      logCallback(
        `Processing file(s): ${numberOfCompletedCompressions} of ${totalFiles} Compressed`
      )
    else
      logCallback(
        `Processing file(s):
        ${numberOfCompletedUploads} of ${totalFiles} Uploaded`
      )
  }

  return fileUploadCompleteCallback
}

export default fileUploadStatusLogger

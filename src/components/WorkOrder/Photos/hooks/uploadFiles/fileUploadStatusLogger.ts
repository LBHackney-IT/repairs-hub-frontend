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
    logCallback(
      `Processing file(s): ${numberOfCompletedCompressions} of ${totalFiles} Compressed | ` +
        `${numberOfCompletedUploads} of ${totalFiles} Uploaded`
    )
  }

  return fileUploadCompleteCallback
}

export default fileUploadStatusLogger

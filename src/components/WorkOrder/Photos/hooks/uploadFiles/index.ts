import getPresignedUrls from './getPresignedUrls'
import uploadFilesToS3 from './uploadFilesToS3'
import completeUpload from './completeUpload'

const uploadFiles = async (
  files: File[],
  workOrderReference: string,
  uploadGroupLabel: string,
  description: string,
  setLoadingStatus = null
): Promise<{
  success: boolean
  requestError?: string
}> => {
  if (setLoadingStatus !== null) {
    setLoadingStatus(`Uploading ${files.length} file(s)`)
  }

  // 1. get presigned urls
  const uploadUrlsResult = await getPresignedUrls(
    workOrderReference,
    files.length
  )

  if (!uploadUrlsResult.success) {
    if (setLoadingStatus !== null) setLoadingStatus(null)

    return {
      success: false,
      requestError: uploadUrlsResult.error,
    }
  }

  const presignedUrls = uploadUrlsResult.result.links

  function onProgress(completed: number, total: number) {
    setLoadingStatus(`${completed} of ${total} file(s) uploaded`)
  }

  // 2. Upload files to S3
  const uploadFilesToS3Response = await uploadFilesToS3(
    files,
    presignedUrls,
    onProgress
  )

  if (!uploadFilesToS3Response.success) {
    if (setLoadingStatus !== null) setLoadingStatus(null)

    return {
      success: false,
      requestError: uploadFilesToS3Response.error,
    }
  }

  // 3. Complete upload
  const completeUploadResult = await completeUpload(
    workOrderReference,
    presignedUrls.map((x) => x.key),
    description,
    uploadGroupLabel
  )

  if (!completeUploadResult.success) {
    if (setLoadingStatus !== null) setLoadingStatus(null)

    return {
      success: false,
      requestError: completeUploadResult.error,
    }
  }

  return {
    success: true,
  }
}

export default uploadFiles

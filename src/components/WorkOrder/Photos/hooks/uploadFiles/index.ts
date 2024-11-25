import getPresignedUrls from './getPresignedUrls'
import uploadFilesToS3 from './uploadFilesToS3'
import completeUpload from './completeUpload'

const uploadFiles = async (
  files: File[],
  workOrderReference: string,
  description: string,
  uploadGroupLabel: string,
  fileUploadCompleteCallback: () => void
): Promise<{
  success: boolean
  requestError?: string
}> => {
  // 1. get presigned urls
  const uploadUrlsResult = await getPresignedUrls(
    workOrderReference,
    files.length
  )

  if (!uploadUrlsResult.success) {
    return {
      success: false,
      requestError: uploadUrlsResult.error,
    }
  }

  const presignedUrls = uploadUrlsResult.result.links

  // 2. Upload files to S3
  const uploadFilesToS3Response = await uploadFilesToS3(
    files,
    presignedUrls,
    fileUploadCompleteCallback
  )

  if (!uploadFilesToS3Response.success) {
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

import getPresignedUrls from './getPresignedUrls'
import uploadFilesToS3 from './uploadFilesToS3'
import completeUpload from './completeUpload'
import { captureException } from '@sentry/nextjs'

class FileUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileUploadError'
  }
}

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
  try {
    // 1. get presigned urls
    const uploadUrlsResult = await getPresignedUrls(
      workOrderReference,
      files.length
    )
    if (!uploadUrlsResult.success)
      throw new FileUploadError(uploadUrlsResult.error as string)

    const presignedUrls = uploadUrlsResult.result.links

    // 2. Upload files to S3
    const uploadFilesToS3Response = await uploadFilesToS3(
      files,
      presignedUrls,
      fileUploadCompleteCallback
    )
    if (!uploadFilesToS3Response.success)
      throw new FileUploadError(uploadFilesToS3Response.error as string)

    // 3. Complete upload
    const completeUploadResult = await completeUpload(
      workOrderReference,
      presignedUrls.map((x) => x.key),
      description,
      uploadGroupLabel
    )
    if (!completeUploadResult.success)
      throw new FileUploadError(completeUploadResult.error as string)
  } catch (error) {
    if (error instanceof FileUploadError)
      captureException('Failed to upload photos', {
        tags: {
          section: 'File upload',
        },
        extra: {
          workOrderReference,
          files,
          message: error.message,
        },
      })
    return {
      success: false,
      requestError: error.message || 'An error occurred while uploading files',
    }
  }

  return {
    success: true,
  }
}

export default uploadFiles

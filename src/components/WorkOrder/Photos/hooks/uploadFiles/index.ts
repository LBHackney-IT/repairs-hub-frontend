import getPresignedUrls from './getPresignedUrls'
import uploadFilesToS3 from './uploadFilesToS3'
import completeUpload from './completeUpload'
import { captureException } from '@sentry/nextjs'
import fileUploadStatusLogger from './fileUploadStatusLogger'
import { compressFile } from './compressFile'
import { clearSessionStorage, getCachedFile, setCachedFile } from './cacheFile'
import faultTolerantRequest from './faultTolerantRequest'

export class FileUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileUploadError'
  }
}

function fileCacheKey(file: File): string {
  return `compressed-${file.name}-${file.size}`
}

const uploadFiles = async (
  files: File[],
  workOrderReference: string,
  description: string,
  uploadGroupLabel: string,
  setUploadStatus: (status: string | null) => void
): Promise<{
  success: boolean
  requestError?: string
}> => {
  try {
    const statusLogger = fileUploadStatusLogger(files.length, setUploadStatus)

    // 1. Try to get cached files before compression
    const filesToUpload: File[] = []
    const filesToCompress: File[] = []
    for (const file of files) {
      const cachedFile = await getCachedFile(fileCacheKey(file), file)
      if (cachedFile) {
        filesToUpload.push(cachedFile)
        statusLogger('Compress')
      } else {
        filesToCompress.push(file)
      }
    }

    // 2. Compress and cache files that were not cached
    const compressionErrors: Error[] = []
    for (const file of filesToCompress) {
      try {
        const compressedFile = await compressFile(file)
        filesToUpload.push(compressedFile)
        faultTolerantRequest(() =>
          setCachedFile(fileCacheKey(file), compressedFile)
        )
      } catch (error) {
        filesToUpload.push(file)
        compressionErrors.push(error)
      } finally {
        statusLogger('Compress')
      }
    }

    // 3. Get presigned urls
    const uploadUrlsResult = await getPresignedUrls(
      workOrderReference,
      filesToUpload.length
    )
    if (!uploadUrlsResult.success)
      throw new FileUploadError(uploadUrlsResult.error as string)

    const presignedUrls = uploadUrlsResult.result.links

    // 4. Upload files to S3
    const uploadFilesToS3Response = await uploadFilesToS3(
      filesToUpload,
      presignedUrls,
      () => statusLogger('Upload')
    )
    if (!uploadFilesToS3Response.success)
      throw new FileUploadError(
        (uploadFilesToS3Response.error as string) +
          (compressionErrors.length &&
            `| Compression error: ${compressionErrors?.[0]?.message}`)
      )

    // 5. Complete upload
    const completeUploadResult = await completeUpload(
      workOrderReference,
      presignedUrls.map((x) => x.key),
      description,
      uploadGroupLabel
    )
    if (!completeUploadResult.success)
      throw new FileUploadError(completeUploadResult.error as string)

    // Clear cache
    clearSessionStorage()
  } catch (error) {
    if (error instanceof FileUploadError)
      captureException('Failed to upload photos', {
        tags: {
          section: 'File upload',
        },
        extra: {
          workOrderReference,
          files: JSON.stringify(
            files.map((file) => ({
              name: file.name,
              size: file.size,
              type: file.type,
            }))
          ),
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

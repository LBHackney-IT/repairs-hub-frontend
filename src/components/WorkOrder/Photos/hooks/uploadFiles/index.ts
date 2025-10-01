import getPresignedUrls from './getPresignedUrls'
import uploadFilesToS3 from './uploadFilesToS3'
import completeUpload from './completeUpload'
import { captureException } from '@sentry/nextjs'
import fileUploadStatusLogger from './fileUploadStatusLogger'
import compressFile from './compressFile'
import { getCachedFile, setCachedFile } from './cacheFile'
import ensureAllFilesReadable from './ensureAllFilesReadable'
import useCloudwatchLogger from '@/root/src/utils/cloudwatchLogger'

export class FileUploadError extends Error {
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
  setUploadStatus: (status: string) => void,
  cwLogger: ReturnType<typeof useCloudwatchLogger>
): Promise<{
  success: boolean
  requestError?: string
}> => {
  try {
    const statusLogger = fileUploadStatusLogger(files.length, setUploadStatus)

    // 1. Get cached files to upload or compress and cache them
    const filesToUpload: File[] = []
    const compressionErrors: Error[] = []

    for (const file of files) {
      try {
        let fileToUpload = await getCachedFile(file)

        if (fileToUpload == null) {
          fileToUpload = await compressFile(file)
          await setCachedFile(fileToUpload)
        }

        filesToUpload.push(fileToUpload)
      } catch (error) {
        filesToUpload.push(file)
        compressionErrors.push(error as Error)
      } finally {
        statusLogger('Compress')
      }
    }

    // 2. Get presigned urls
    const uploadUrlsResult = await getPresignedUrls(
      workOrderReference,
      filesToUpload.length
    )
    if (!uploadUrlsResult.success)
      throw new FileUploadError(uploadUrlsResult.error as string)

    const presignedUrls = uploadUrlsResult.result.links

    // 3. Upload files to S3
    await ensureAllFilesReadable(filesToUpload)
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

    // 4. Complete upload
    const completeUploadResult = await completeUpload(
      workOrderReference,
      presignedUrls.map((x) => x.key),
      description,
      uploadGroupLabel
    )
    if (!completeUploadResult.success)
      throw new FileUploadError(completeUploadResult.error as string)
  } catch (error) {
    if (error instanceof FileUploadError) {
      cwLogger.error(error.message)
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
    }
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

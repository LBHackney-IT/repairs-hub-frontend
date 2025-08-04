import { Link } from '../types'
import imageCompression from 'browser-image-compression'
import faultTolerantRequest from './faultTolerantRequest'
import uploadFileToS3 from './uploadFileToS3'

const uploadFilesToS3 = async (
  files: File[],
  links: Link[],
  fileUploadCompleteCallback: () => void
): Promise<{ success: boolean; error?: any }> => {
  const promiseList = files.map((file, i) => {
    return uploadWrapper(file, links[i])
  })

  // wrap with callback to track how many have been completed
  const wrappedPromises = promiseList.map((promise) =>
    promise.then((result) => {
      fileUploadCompleteCallback()
      return result
    })
  )

  try {
    const results = await Promise.allSettled(wrappedPromises)

    const successfulResults = results.filter(
      (x) => x.status === 'fulfilled' && x.value.success
    )

    const allSuccessed = successfulResults.length === results.length

    if (allSuccessed) return { success: true }

    return {
      success: false,
      error: 'Some photos failed to upload. Please try again',
    }
  } catch (error) {
    return { success: false, error }
  }
}

const uploadWrapper = async (
  file: File,
  link: Link
): Promise<{
  success: boolean
  error?: unknown
}> => {
  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    maxIteration: 1,
  }

  let fileToUpload: File
  // Need to destructure because these are non-enumerable properties
  const { name, size, type, lastModified } = file
  const fileDetails = { name, size, type }

  console.log('preparing to upload file', JSON.stringify(fileDetails))

  // try to compress file. If fails, just use file
  try {
    fileToUpload = await imageCompression(file, compressionOptions)
  } catch (err) {
    console.error(
      'failed to compress file - using original',
      JSON.stringify(fileDetails),
      'with error',
      err
    )
    // Need to re-create the File as it may be corrupted after failed compression
    fileToUpload = new File([file], name, { type, lastModified })
  }

  const result = await faultTolerantRequest(
    async () =>
      await uploadFileToS3(fileToUpload, link).catch((err) => {
        console.error(
          'uploadFileToS3 failed for file',
          JSON.stringify(fileDetails),
          'with error',
          JSON.stringify({ name: err.name, message: err.message })
        )
        throw err
      })
  )

  return result
}

export default uploadFilesToS3

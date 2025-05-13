import { Link } from '../types'
import imageCompression from 'browser-image-compression'
import faultTolerantRequest from './faultTolerantRequest'
import uploadFileToS3 from './uploadFileToS3'

const uploadFilesToS3Series = async (
  files: File[],
  links: Link[],
  fileUploadCompleteCallback: () => void
): Promise<{ success: boolean; error?: any }> => {
  let allSucceeded = true

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const link = links[i]

    try {
      const result = await uploadWrapper(file, link)

      if (!result.success) {
        allSucceeded = false
      }
    } catch (error) {
      console.error(`Error uploading file ${i}:`, error)
      allSucceeded = false
    } finally {
      fileUploadCompleteCallback()
    }
  }

  if (allSucceeded) {
    return { success: true }
  } else {
    return {
      success: false,
      error: 'Some photos failed to upload. Please try again',
    }
  }
}

const uploadFilesToS3Parallel = async (
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
  error?: any
}> => {
  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    maxIteration: 1,
  }

  let fileToUpload = file

  try {
    fileToUpload = await imageCompression(file, compressionOptions)
  } catch (err) {
    console.error('failed to compress file - using original', err)
  }

  const result = await faultTolerantRequest(
    async () => await uploadFileToS3(fileToUpload, link)
  )

  return result
}

export default uploadFilesToS3Series

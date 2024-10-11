import { Link } from '../types'
import imageCompression from 'browser-image-compression'
import faultTolerantRequest from './faultTolerantRequest'
import uploadFileToS3 from './uploadFileToS3'

const uploadFilesToS3 = async (
  files: File[],
  links: Link[],
  onProgress: (completed: number, total: number) => void
): Promise<{ success: boolean; error?: any }> => {
  console.log({ links })

  // to remove - forces first file upload to fail
  //   links[0].presignedUrl += 'h'

  const promiseList = files.map((file, i) => {
    return uploadWrapper(file, links[i])
  })

  let completed = 0

  // wrap with callback to track how many have been completed
  const wrappedPromises = promiseList.map((promise) =>
    promise.then((result) => {
      completed += 1
      onProgress(completed, promiseList.length)
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

  const compressedFile = await imageCompression(file, compressionOptions)

  return faultTolerantRequest(
    async () => await uploadFileToS3(compressedFile, link)
  )
}

export default uploadFilesToS3

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
  error?: any
}> => {
  const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    maxIteration: 1,
  }

  let fileToUpload = file

  // try to compress file. If fails, just use file
  try {
    fileToUpload = await imageCompression(file, compressionOptions)
  } catch (err) {
    console.error(
      'failed to compress file - using original',
      {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      'with error',
      JSON.stringify(err)
    )
  }

  console.log('uploading file', file.name)

  const result = await faultTolerantRequest(
    async () =>
      await uploadFileToS3(fileToUpload, link).catch((err) => {
        console.error(
          'uploadFileToS3 failed for file',
          {
            name: file.name,
            size: file.size,
            type: file.type,
          },
          'with error',
          JSON.stringify(err)
        )
        throw err
      })
  )

  return result
}

export default uploadFilesToS3

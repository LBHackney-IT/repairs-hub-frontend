import { Link } from '../types'
import { compressFile } from './compressFile'
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
  // Need to destructure because these are non-enumerable properties
  const { name, size, type } = file
  const fileDetails = { name, size, type }

  console.log('preparing to upload file', JSON.stringify(fileDetails))
  const compressResult = await compressFile(file)
  const result = await faultTolerantRequest(
    async () =>
      await uploadFileToS3(compressResult.file, link).catch((err) => {
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

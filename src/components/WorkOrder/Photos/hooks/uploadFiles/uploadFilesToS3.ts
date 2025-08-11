import axios from 'axios'
import { Link } from '../types'
import faultTolerantRequest from './faultTolerantRequest'

const uploadFilesToS3 = async (
  files: File[],
  links: Link[],
  fileUploadCompleteCallback: () => void
): Promise<{ success: boolean; error?: unknown }> => {
  // Upload in parallel for faster performance on good internet connections
  try {
    await Promise.all(
      files.map(async (compressedFile, i) => {
        await uploadFileToS3(compressedFile, links[i])
        fileUploadCompleteCallback()
      })
    )
  } catch (error) {
    return {
      success: false,
      error: 'Some photos failed to upload. Please try again. ' + error,
    }
  }

  return { success: true }
}

const uploadFileToS3 = async (
  file: File,
  link: Link
): Promise<{ success: boolean; error?: unknown }> => {
  // Need to destructure because these are non-enumerable properties
  const { name, size, type } = file
  const fileDetails = { name, size, type }

  console.log('preparing to upload file', JSON.stringify(fileDetails))
  const result = await faultTolerantRequest(() =>
    axios
      .request({
        method: 'PUT',
        url: link.presignedUrl,
        data: file,
      })
      .catch((err) => {
        console.error(
          'uploadFileToS3 failed for file',
          JSON.stringify(fileDetails),
          'with error',
          JSON.stringify({ name: err.name, message: err.message })
        )
        throw err
      })
  )

  if (!result.success) {
    throw result.error
  }

  return result
}

export default uploadFilesToS3

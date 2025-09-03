import { filesize } from 'filesize'

const allowedFileTypes = new Set(['image/png', 'image/jpeg'])
const MAX_FILE_SIZE = 20000000
const MAX_FILE_COUNT = 10

const validateFileUpload = (files) => {
  if (files.length === 0) return null

  if (files.length > MAX_FILE_COUNT) {
    return `You cannot attach more than ${MAX_FILE_COUNT} photos. You attached ${files.length}.`
  }

  for (const file of files) {
    if (!allowedFileTypes.has(file.type)) {
      return `Unsupported file type "${file.type}". Allowed types: PNG & JPG`
    }

    //20mb
    if (file.size > MAX_FILE_SIZE) {
      return `Filesize cannot exceed ${filesize(MAX_FILE_SIZE)}`
    }
  }

  return null
}

export default validateFileUpload

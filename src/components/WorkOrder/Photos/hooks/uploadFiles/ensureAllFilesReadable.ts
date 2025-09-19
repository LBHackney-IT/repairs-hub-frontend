import { FileUploadError } from '.'

/**
 * Ensures all files are readable by the browser.
 * Can help to "fail fast" if the file becomes unreadable due to memory freeing or metadata change
 * @param files Array of files to check
 * @returns Promise that resolves if all files are readable, rejects if any are not
 */
function ensureAllFilesReadable(files: Array<File>) {
  return Promise.all(
    files.map(async (file) => {
      try {
        // Attempt to read the first kilobyte of the file to ensure it is valid and accessible
        await file.slice(0, 1024).arrayBuffer()
      } catch (err) {
        const errorMessage = `Could not read the file "${file.name}". Please remove and re-select it. Error: ${err.message}`
        console.error(errorMessage, err)
        throw new FileUploadError(errorMessage)
      }
    })
  )
}

export default ensureAllFilesReadable

import imageCompression from 'browser-image-compression'

async function compressFile(file: File): Promise<File> {
  try {
    const compressResult = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      maxIteration: 1,
    })
    console.log('compression result', {
      name: file.name,
      size: file.size,
      type: file.type,
    })
    return compressResult
  } catch (error) {
    let errorMessage = `File compression failed with BIC for "${file.name}":`
    if (error instanceof ProgressEvent) {
      // This error is thrown by browser-image-compression
      const fileReaderError = (error.currentTarget as FileReader).error
      errorMessage += ` ${fileReaderError}. Try re-uploading this file.`
    } else {
      errorMessage += ` ${error?.message || error?.type || error}`
    }
    console.error(errorMessage)
    throw new Error(errorMessage)
  }
}

export default compressFile

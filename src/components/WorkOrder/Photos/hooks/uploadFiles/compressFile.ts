import { fetchSimpleFeatureToggles } from '@/root/src/utils/frontEndApiClient/requests'
import imageCompression, {
  Options as CompressionOptions,
} from 'browser-image-compression'
import Compressor from 'compressorjs'

function fileDetails(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

async function compressWithBrowserImageCompression(file: File): Promise<File> {
  const compressionOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    maxIteration: 1,
  }
  const compressedFile = await imageCompression(file, compressionOptions)
  return compressedFile
}

function compressWithCompressorJS(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      success: (compressedFile: File) => resolve(compressedFile),
      error: (err) => reject(err),
    })
  })
}

async function compressFile(file: File): Promise<File> {
  const featureToggles = await fetchSimpleFeatureToggles()

  // Use browser-image-compression as default
  let compressResult: File

  try {
    if (featureToggles.useCompressorJS) {
      compressResult = await compressWithCompressorJS(file)
    } else {
      // Use browser-image-compression as default
      compressResult = await compressWithBrowserImageCompression(file)
    }
  } catch (error) {
    const compressLibrary = featureToggles.useCompressorJS ? 'CJS' : 'BIC'
    let errorMessage = `File compression failed with ${compressLibrary} for "${file.name}":`
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
  return compressResult
}

export default compressFile

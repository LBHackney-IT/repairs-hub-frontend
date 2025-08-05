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

export interface CompressResult {
  success: boolean
  file: File
}

async function compressWithBrowserImageCompression(
  file: File
): Promise<CompressResult> {
  console.log(
    'Compressing file with browser-image-compression',
    fileDetails(file)
  )
  const compressionOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    maxIteration: 1,
  }
  const compressedFile = await imageCompression(file, compressionOptions)
  return { success: true, file: compressedFile }
}

function compressWithCompressorJS(file: File): Promise<CompressResult> {
  console.log('Compressing file with CompressorJS', fileDetails(file))
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      success: (compressedFile: File) => {
        resolve({ success: true, file: compressedFile })
      },
      error: (err) => reject(err),
    })
  })
}

export async function compressFile(file: File): Promise<CompressResult> {
  const featureToggles = await fetchSimpleFeatureToggles()

  // Use browser-image-compression as default
  let compressResult: CompressResult

  try {
    if (featureToggles.useCompressorJS) {
      compressResult = await compressWithCompressorJS(file)
    } else {
      // Use browser-image-compression as default
      compressResult = await compressWithBrowserImageCompression(file)
    }
  } catch (error) {
    console.error('File compression failed:', error)
    compressResult = {
      success: false,
      file: new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      }),
    }
  }
  console.log('compression result', {
    success: compressResult.success,
    ...fileDetails(compressResult.file),
  })
  return compressResult
}

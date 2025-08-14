import { FileUploadError } from '.'

function fileDetails(file: File) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

async function dataURLtoFile(
  dataUrl: string,
  filename: string,
  fileType: string
): Promise<File> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return new File([blob], filename, { type: fileType })
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(blob)
  })
}

export async function getCachedFile(
  cacheKey: string,
  originalFile: File
): Promise<File | null> {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const cachedDataUrl = window.sessionStorage.getItem(cacheKey)
    if (cachedDataUrl) {
      try {
        const cachedFile = await dataURLtoFile(
          cachedDataUrl,
          originalFile.name,
          originalFile.type
        )
        console.log('Retrieved cached file:', fileDetails(cachedFile))
        try {
          // Attempt to read the first kilobyte of the file to ensure it is valid and accessible
          await cachedFile.slice(0, 1024).arrayBuffer()
        } catch (err) {
          const errorMessage = `Could not read the file "${originalFile.name}". Please remove and re-select it. Error: ${err.message}`
          console.error(errorMessage, err)
          throw new FileUploadError(errorMessage)
        }
        return cachedFile
      } catch (error) {
        console.error('Error converting cached data URL to file:', error)
        // If conversion fails, proceed to compress again
      }
    }
  }
  return null
}

export async function setCachedFile(
  cacheKey: string,
  file: File
): Promise<void> {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const dataUrl = await blobToDataURL(file)
      window.sessionStorage.setItem(cacheKey, dataUrl)
      console.log('Cached compressed file:', fileDetails(file))
    } catch (error) {
      console.error('Error caching file:', error)
    }
  }
}

export async function clearSessionStorage(): Promise<void> {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear()
    console.log('Cleared all cached files')
  }
}

import { useEffect } from 'react'

function blobToFile(blob: Blob): File | undefined {
  try {
    const name = `photo-${Date.now()}`
    const type = blob.type || 'application/octet-stream'
    const lastModified = Date.now()
    return new File([blob], name, { type, lastModified })
  } catch (convErr) {
    console.warn(
      'useUpdateFileInput: failed to convert Blob to File, skipping',
      convErr,
      blob
    )
  }
}

const useUpdateFileInput = (
  inputRef: React.RefObject<HTMLInputElement>,
  files: (File | Blob)[]
) => {
  useEffect(() => {
    if (!files || files.length === 0) {
      if (inputRef.current) inputRef.current.value = ''
      return
    }
    try {
      const dataTransfer = new DataTransfer()

      for (const file of files) {
        if (file instanceof File) {
          dataTransfer.items.add(file)
          continue
        }
        // if we can't process it as a file, try converting from a blob
        const fileObj = blobToFile(file)
        if (fileObj) {
          dataTransfer.items.add(fileObj)
          continue
        }
      }

      if (inputRef.current) inputRef.current.files = dataTransfer.files
    } catch (err) {
      console.error('useUpdateFileInput: failed to update input.files', err)
    }
  }, [files, inputRef])
}

export default useUpdateFileInput

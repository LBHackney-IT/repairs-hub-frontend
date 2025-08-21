import { useEffect } from 'react'

function blobToFile(blob: Blob): File {
  const name = `photo-${Date.now()}`
  const type = blob.type || 'application/octet-stream'
  const lastModified = Date.now()
  return new File([blob], name, { type, lastModified })
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

      files.forEach((file) => {
        if (file instanceof File) {
          dataTransfer.items.add(file)
          return
        }
        if (
          file instanceof Blob ||
          (file && typeof file === 'object' && 'size' in file)
        ) {
          try {
            const fileObj = blobToFile(file)
            dataTransfer.items.add(fileObj)
            return
          } catch (convErr) {
            console.warn(
              'useUpdateFileInput: failed to convert Blob to File, skipping',
              convErr,
              file
            )
            return
          }
        }
        console.warn('useUpdateFileInput: skipping non-File entry', file)
      })

      if (inputRef.current) inputRef.current.files = dataTransfer.files
    } catch (err) {
      console.error('useUpdateFileInput: failed to update input.files', err)
    }
  }, [files, inputRef])
}

export default useUpdateFileInput

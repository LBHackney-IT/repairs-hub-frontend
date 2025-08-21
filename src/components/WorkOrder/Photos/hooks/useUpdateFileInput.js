import { useEffect } from 'react'

const useUpdateFileInput = (files, inputRef) => {
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
            const name = file.name || `photo-${Date.now()}`
            const type = file.type || 'application/octet-stream'
            const lastModified =
              (file.lastModified && Number(file.lastModified)) || Date.now()
            const fileObj = new File([file], name, { type, lastModified })
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

import { useEffect } from 'react'

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
      }

      if (inputRef.current) inputRef.current.files = dataTransfer.files
    } catch (err) {
      console.error('useUpdateFileInput: failed to update input.files', err)
    }
  }, [files, inputRef])
}

export default useUpdateFileInput

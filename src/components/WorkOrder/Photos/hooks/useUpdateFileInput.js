import { useEffect } from 'react'

const useUpdateFileInput = (files, inputRef) => {
  useEffect(() => {
    if (files.length === 0) {
      inputRef.current.value = ''
      return
    }

    const dataTransfer = new DataTransfer()

    files.forEach((file) => {
      dataTransfer.items.add(file)
    })

    inputRef.current.files = dataTransfer.files
  }, [files, inputRef])
}

export default useUpdateFileInput

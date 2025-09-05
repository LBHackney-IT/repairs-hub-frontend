import { useEffect } from 'react'

interface UseUpdateFileInputProps {
  files: File[]
  setPreviewFiles: (files: React.SetStateAction<File[]>) => void
  inputRef: React.RefObject<HTMLInputElement>
}

const useUpdateFileInput = (props: UseUpdateFileInputProps): void => {
  const { files, setPreviewFiles, inputRef } = props

  useEffect(() => {
    // remove preview files if file was removed - by name
    setPreviewFiles((prev) =>
      prev.filter((f) => files.some((file) => file.name === f.name))
    )

    if (!inputRef?.current) return

    // clear the input value so that the same file can be re-uploaded if needed
    if (files?.length === 0) {
      inputRef.current.value = ''
      return
    }
    // update the input's FileList to match the current files state
    const dataTransfer = new DataTransfer()
    for (const file of files) {
      dataTransfer.items.add(file)
    }
    inputRef.current.files = dataTransfer.files
  }, [files, inputRef])
}

export default useUpdateFileInput

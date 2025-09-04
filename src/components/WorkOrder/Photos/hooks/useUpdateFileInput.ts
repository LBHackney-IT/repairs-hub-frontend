import { useEffect } from 'react'

interface UseUpdateFileInputProps {
  files: File[]
  setPreviewFiles: (
    files:
      | Array<{ name: string }>
      | ((prev: Array<{ name: string }>) => Array<{ name: string }>)
  ) => void
  inputRef: React.RefObject<HTMLInputElement>
}

const useUpdateFileInput = (props: UseUpdateFileInputProps): void => {
  const { files, setPreviewFiles, inputRef } = props

  useEffect(() => {
    // clear the input value so that the same file can be re-uploaded if needed
    if (inputRef.current) inputRef.current.value = ''

    // remove preview files if file was removed - by name
    setPreviewFiles((prev) =>
      prev.filter((f) => files.some((file) => file.name === f.name))
    )

    // Update the input's FileList to match the current files state
    const dataTransfer = new DataTransfer()
    files.forEach((file) => dataTransfer.items.add(file))
    if (inputRef.current) inputRef.current.files = dataTransfer.files
  }, [files, inputRef])
}

export default useUpdateFileInput

import { useEffect, useState } from 'react'
import uploadFiles from './uploadFiles'
import validateFileUpload from './validateFileUpload'
import { captureException } from '@sentry/nextjs'

const useFileUpload = (workOrderReference, onSuccess) => {
  const [loadingStatus, setLoadingStatus] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [requestError, setRequestError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)

  const [files, setFiles] = useState([])

  useEffect(() => {
    if (requestError === null) return

    // capture request error on sentry
    captureException(requestError, {
      tags: {
        section: 'File upload',
      },
      extra: {
        workOrderReference,
        files,
      },
    })
  }, [requestError])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loadingStatus) return

    // reset
    setUploadSuccess(null)
    setRequestError(null)
    setValidationError(null)

    const validationResult = validateFileUpload(files)
    setValidationError(validationResult)
    if (validationResult !== null) return

    const description = e.target.description.value

    const uploadResult = await uploadFiles(
      files,
      workOrderReference,
      'Uploaded directly to work order',
      description,
      setLoadingStatus
    )

    setLoadingStatus(null)

    if (!uploadResult.success) {
      setRequestError(uploadResult.requestError.message)
      return
    }

    setUploadSuccess(
      ` ${files.length} ${
        files.length === 1 ? 'photo has' : 'photos have'
      } been added to the work order`
    )
    setFiles([])
    onSuccess()
  }

  return {
    files,
    handleSubmit,
    uploadSuccess,
    setFiles,
    validationError,
    requestError,
    loadingStatus,
  }
}

export default useFileUpload

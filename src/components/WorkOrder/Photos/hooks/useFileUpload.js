import { useState } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

import axios from 'axios'
import { filesize } from 'filesize'
import imageCompression from 'browser-image-compression'

const useFileUpload = (workOrderReference, onSuccess) => {
  const [loadingStatus, setLoadingStatus] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [requestError, setRequestError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)

  const [files, setFiles] = useState([])

  const allowedFileTypes = new Set(['image/png', 'image/jpeg'])
  const MAX_FILE_SIZE = 20000000
  const MAX_FILE_COUNT = 10

  const validateRequest = (files) => {
    if (files.length === 0) {
      return 'Please select at least one photo'
    }

    if (files.length > MAX_FILE_COUNT) {
      return 'You cannot attach more than 10 photo'
    }

    files.forEach((file) => {
      if (!allowedFileTypes.has(file.type)) {
        return `Unsupported file type "${file.type}". Allowed types: PNG & JPG`
      }

      //20mb
      if (file.size > MAX_FILE_SIZE) {
        return `Filesize cannot exceed ${filesize(MAX_FILE_SIZE)}`
      }
    })

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loadingStatus) return

    // reset
    setUploadSuccess(null)
    setRequestError(null)

    // validate fields
    const validation = validateRequest(files)
    setValidationError(validation)
    if (validation !== null) return

    setLoadingStatus(`Uploading ${files.length} file(s)`)

    // 1. get presigned urls
    const uploadUrlsResult = await getUploadLinks(
      workOrderReference,
      files.length
    )

    if (!uploadUrlsResult.success) {
      setRequestError(uploadUrlsResult.error)
      setLoadingStatus(null)
      return
    }

    const presignedUrls = uploadUrlsResult.result.links

    function onProgress(completed, total) {
      setLoadingStatus(`${completed} of ${total} files uploaded`)
    }

    // 2. Upload files to S3
    const uploadFilesToS3Response = await uploadFilesToS3(
      files,
      presignedUrls,
      onProgress
    )

    if (!uploadFilesToS3Response.success) {
      setRequestError(uploadFilesToS3Response.error)
      setLoadingStatus(null)
      return
    }

    // 3. Complete upload

    const completeUploadResult = await completeUpload(
      workOrderReference,
      presignedUrls.map((x) => x.key)
    )

    if (!completeUploadResult.success) {
      setValidationError(completeUploadResult.error)
      setLoadingStatus(null)
      return
    }

    // show success message
    setUploadSuccess(true)

    // reset form
    setFiles([])
    setLoadingStatus(null)

    onSuccess()
  }

  const getUploadLinks = async (workOrderReference, numberOfFiles) => {
    try {
      const result = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/images/uploadLink`,
        params: {
          workOrderReference: workOrderReference,
          numberOfFiles: numberOfFiles,
        },
      })

      return { success: true, result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const uploadFileToS3 = async (file, link) => {
    const compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      maxIteration: 1,
    }

    const compressedFile = await imageCompression(file, compressionOptions)

    return axios.request({
      method: 'PUT',
      url: link.presignedUrl,
      data: compressedFile,
    })
  }

  const uploadFilesToS3 = async (files, links, onProgress) => {
    const promiseList = []
    let completed = 0

    files.forEach((file, i) => {
      promiseList.push(uploadFileToS3(file, links[i]))
    })

    // wrap with callback to track how many have been completed
    const wrappedPromises = promiseList.map((promise) =>
      promise.then((result) => {
        completed += 1
        onProgress(completed, promiseList.length)
        return result
      })
    )

    try {
      const result = await Promise.allSettled(wrappedPromises)

      return { success: true, result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const completeUpload = async (workOrderReference, s3Keys) => {
    try {
      const result = await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrders/images/completeUpload`,
        requestData: {
          workOrderReference: workOrderReference,
          s3Objects: s3Keys,
          uploadGroupLabel: 'Uploaded directly to work order',
        },
      })

      return { success: true, result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    files,
    handleSubmit,
    uploadSuccess,
    setFiles,
    validationError,
    requestError,
    loadingStatus: loadingStatus,
  }
}

export default useFileUpload

import { useState } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

import axios from 'axios'
import { filesize } from 'filesize'

const useFileUpload = (workOrderReference, onSuccess) => {
  const [isUploading, setIsUploading] = useState(false)
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

    if (isUploading) return

    // reset
    setUploadSuccess(null)
    setRequestError(null)

    // validate fields
    const validation = validateRequest(files)
    setValidationError(validation)
    if (validation !== null) return

    setIsUploading(true)

    // 1. get presigned urls

    const uploadUrlsResult = await getUploadLinks(
      workOrderReference,
      files.length
    )

    if (!uploadUrlsResult.success) {
      setRequestError(uploadUrlsResult.error)
      setIsUploading(false)
      return
    }

    const presignedUrls = uploadUrlsResult.result.links

    console.log({ uploadUrlsResult, presignedUrls })

    // 2. Upload files to S3
    const uploadFilesToS3Response = await uploadFilesToS3(files, presignedUrls)

    if (!uploadFilesToS3Response.success) {
      setRequestError(uploadFilesToS3Response.error)
      setIsUploading(false)
      return
    }

    // 3. Complete upload

    const completeUploadResult = await completeUpload(
      workOrderReference,
      presignedUrls.map((x) => x.key)
    )

    if (!completeUploadResult.success) {
      setValidationError(completeUploadResult.error)
      setIsUploading(false)
      return
    }

    // show success message
    setUploadSuccess(true)

    // reset form
    setFiles([])
    setIsUploading(false)

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

  const uploadFilesToS3 = async (files, links) => {
    const promiseList = []

    console.log({ links, files })

    files.forEach((file, i) => {
      const parts = links[i].presignedUrl.split('/')
      parts.splice(0, 3)

      const url = `/api/yeet/${parts.join('/')}`

      promiseList.push(
        axios.request({
          method: 'PUT',
          url: url,
          data: file,
        })
      )
    })

    try {
      const result = await Promise.allSettled(promiseList)

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
          uploadGroupLabel: 'doesnt do anything yet',
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
    isUploading,
  }
}

export default useFileUpload

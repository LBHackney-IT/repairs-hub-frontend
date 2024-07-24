import axios from 'axios'
import imageCompression from 'browser-image-compression'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'

const uploadFiles = async (
  files,
  workOrderReference,
  uploadGroupLabel,
  description,
  setLoadingStatus = null
) => {
  if (setLoadingStatus !== null) {
    setLoadingStatus(`Uploading ${files.length} file(s)`)
  }

  // 1. get presigned urls
  const uploadUrlsResult = await getUploadLinks(
    workOrderReference,
    files.length
  )

  if (!uploadUrlsResult.success) {
    if (setLoadingStatus !== null) setLoadingStatus(null)

    return {
      success: false,
      requestError: uploadUrlsResult.error,
    }
  }

  const presignedUrls = uploadUrlsResult.result.links

  function onProgress(completed, total) {
    setLoadingStatus(`${completed} of ${total} file(s) uploaded`)
  }

  // 2. Upload files to S3
  const uploadFilesToS3Response = await uploadFilesToS3(
    files,
    presignedUrls,
    onProgress
  )

  if (!uploadFilesToS3Response.success) {
    if (setLoadingStatus !== null) setLoadingStatus(null)

    return {
      success: false,
      requestError: uploadFilesToS3Response.error,
    }
  }

  // 3. Complete upload
  const completeUploadResult = await completeUpload(
    workOrderReference,
    presignedUrls.map((x) => x.key),
    uploadGroupLabel,
    description
  )

  if (!completeUploadResult.success) {
    if (setLoadingStatus !== null) setLoadingStatus(null)

    return {
      success: false,
      requestError: completeUploadResult.error,
    }
  }

  return {
    success: true,
  }
}

const completeUpload = async (
  workOrderReference,
  s3Keys,
  uploadGroupLabel,
  description
) => {
  try {
    const result = await frontEndApiRequest({
      method: 'post',
      path: `/api/workOrders/images/completeUpload`,
      requestData: {
        workOrderReference: workOrderReference,
        s3Objects: s3Keys,
        uploadGroupLabel,
        description,
      },
    })

    return { success: true, result }
  } catch (error) {
    return { success: false, error }
  }
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
    return { success: false, error }
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
    return { success: false, error }
  }
}

export default uploadFiles

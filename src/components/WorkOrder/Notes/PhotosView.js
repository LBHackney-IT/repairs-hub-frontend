import PropTypes from 'prop-types'
import { useState, useEffect, useCallback, useRef } from 'react'
import Spinner from '../../Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { format } from 'date-fns'

import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { PrimarySubmitButton } from '../../Form'
import axios from 'axios'
import ErrorMessage from '../../Errors/ErrorMessage'

const PhotosView = ({ workOrderReference, tabName }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [displayForm, setDisplayForm] = useState(false)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const getPhotosView = async (workOrderReference) => {
    setError(null)

    try {
      const images = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/images`,
      })

      setImages(images)
    } catch (e) {
      setImages(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getPhotosView(workOrderReference)
  }, [])

  const [files, setFiles] = useState([])

  const getUploadLinks = async (workOrderReference, numberOfFiles) => {
    return new Promise((resolve) => {
      frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/images/uploadLink`,

        params: {
          workOrderReference: workOrderReference,
          numberOfFiles: numberOfFiles,
        },
      })
        .then((result) => {
          resolve({ success: true, result, error: null })
        })
        .catch((error) => {
          console.error(error)
          resolve({ success: false, result: null, error: error.message })
        })
    })
  }

  const uploadFilesToS3 = async (files, links) => {
    return new Promise((resolve) => {
      const promiseList = []

      files.forEach(async (file, i) => {
        const parts = links[i].presignedUrl.split('/')
        parts.splice(0, 3)

        const url = `/api/yeet/${parts.join('/')}`

        var config = {
          method: 'PUT',
          url: url,
          data: file,
        }

        promiseList.push(axios.request(config))
      })

      Promise.allSettled(promiseList)
        .then((res) => {
          // console.log({ res })
          resolve({ success: true, result: res, error: null })
        })
        .catch((err) => {
          // console.log({ err })
          resolve({ success: false, result: null, error: err.message })
        })
    })
  }

  const completeUpload = async (workOrderReference, s3Keys) => {
    return new Promise((resolve) => {
      // try {

      frontEndApiRequest({
        method: 'post',
        path: `/api/workOrders/images/completeUpload`,
        requestData: {
          workOrderReference: workOrderReference,
          s3Objects: s3Keys,
          uploadGroupLabel: 'doesnt do anything yet',
        },
      })
        .then((result) => {
          resolve({ success: true, result, error: null })
        })
        .catch((error) => {
          // console.log({ error })
          console.error(error)
          resolve({ success: false, result: null, error: error.message })
        })
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('submit', { files })

    if (files.length === 0) {
      setUploadError('Please select at least one photo')
      return
    }

    if (files.length > 10) {
      setUploadError('You cannot attach more than 10 photo')
      return
    }

    const allowedFileTypes = new Set(['image/png', 'image/jpeg'])

    let invalidFileTypeFound = false
    let tooLargeFileFound = false

    files.forEach((file) => {
      if (!allowedFileTypes.has(file.type)) {
        invalidFileTypeFound = true
      }

      //20mb
      if (file.size > 20000000) {
        tooLargeFileFound = true
      }
    })

    if (invalidFileTypeFound) {
      setUploadError('Unsupported file type. Allowed types: PNG & JPG')
      return
    }

    if (tooLargeFileFound) {
      setUploadError('Filesize cannot exceed 20MB')
      return
    }

    setUploadError(null)
    setIsUploading(true)

    // 1. get upload urls

    const uploadUrlsResult = await getUploadLinks(
      workOrderReference,
      files.length
    )

    if (!uploadUrlsResult.success) {
      setUploadError(uploadUrlsResult.error)
      setIsUploading(false)
      return
    }

    console.log({ uploadUrlsResult })

    const uploadFilesToS3Response = await uploadFilesToS3(
      files,
      uploadUrlsResult.result.links
    )

    console.log({ uploadFilesToS3Response })

    if (!uploadFilesToS3Response.success) {
      setUploadError(uploadFilesToS3Response.error)
      setIsUploading(false)
      return
    }

    // now complete the upload

    const completeUploadResult = await completeUpload(
      workOrderReference,
      uploadUrlsResult.result.links.map((x) => x.key)
    )

    if (!completeUploadResult.success) {
      setUploadError(completeUploadResult.error)
      setIsUploading(false)
      return
    }

    console.log({ completeUploadResult })

    // complete
    setIsUploading(false)
    setFiles([])

    getPhotosView(workOrderReference)
  }

  const inputRef = useRef()

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
  }, [files])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h2>Photos</h2>

          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: '0px',
            }}
          >
            <div>
              <div class="govuk-form-group">
                <label
                  class="govuk-label"
                  for="file-upload-1"
                  style={{ marginTop: '10px' }}
                >
                  Upload a photo (maximum 10)
                </label>

                <input
                  ref={inputRef}
                  class="govuk-file-upload"
                  // id="file-upload-1"
                  name="fileUpload1"
                  type="file"
                  multiple
                  accept=".jpg, .jpeg, .png"
                  id="file-upload"
                  // value={files.map(x => x.name)}
                  // value={}
                  onInput={(e) => {
                    console.log(Object.values(e.target.files))
                    setFiles(Object.values(e.target.files))

                    // const filesArray = []
                  }}
                />

                {uploadError && (
                  <p>
                    <ErrorMessage label={uploadError} />
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',

                    margin: 'calc(-15px + 30px) -15px 0 0',
                  }}
                >
                  {files.map((x, index) => (
                    <div
                      key={x.name}
                      style={{
                        // marginTop: "0px"
                        margin: '15px 15px 0 0',
                        width: '150px',
                      }}
                    >
                      <div
                        style={{
                          marginTop: '0px',
                          border: '1px solid #b1b4b6',
                          width: '150px',
                          height: '150px',
                          padding: '5px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <img
                          style={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                            // height: '150px', width: 'auto'
                          }}
                          src={URL.createObjectURL(x)}
                          alt="Preview Uploaded Image"
                          id="file-preview"
                        />
                      </div>

                      <button
                        style={{
                          flexShrink: '0',
                          flexGrow: '0',
                          marginTop: '5px',
                          display: 'block',
                          background: 'none',
                          border: 'none',
                          textDecoration: 'underline',
                          color: '#025ea6',
                          textAlign: 'right',
                          width: '100%',
                          padding: 0,
                        }}
                        type="button"
                        onClick={() => {
                          setFiles((files) => {
                            var newArr = [...files]
                            newArr.splice(index, 1)
                            return newArr
                          })
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {isUploading && (
                  <div>
                    <Spinner />
                  </div>
                )}

                <PrimarySubmitButton
                  label="Upload"
                  disabled={!files && files.length === 0}
                >
                  Upload
                </PrimarySubmitButton>

                <button type="button">Clear</button>
              </div>
            </div>
          </form>

          <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

          <ul
            className="lbh-body-s "
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {images.map(({ files, groupLabel, id, timestamp, uploadedBy }) => {
              return (
                <li
                  key={id}
                  style={{
                    display: 'block',
                    // borderBottom: '2px solid grey',
                    // marginBottom: '15px',
                    marginTop: '0px',
                    padding: '15px 0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3>{groupLabel}</h3>

                    {/* 25 March 2024, 10:11 */}
                    <div style={{ marginTop: 0 }}>
                      {format(new Date(timestamp), 'dd LLLL yyyy, HH:mm')}
                    </div>
                  </div>
                  <p style={{ marginTop: 0 }}>{uploadedBy}</p>

                  <PhotoProvider>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 'calc(-15px + 30px)',
                        marginLeft: '-15px',
                      }}
                    >
                      {files.map((x) => (
                        <div style={{ marginTop: '15px', marginLeft: '15px' }}>
                          <PhotoView src={x}>
                            <img
                              src={x}
                              style={{ width: 'auto', height: '150px' }}
                            />
                          </PhotoView>
                        </div>
                      ))}
                    </div>
                  </PhotoProvider>
                  <hr
                    className="govuk-section-break govuk-section-break--l govuk-section-break--visible"
                    style={{ marginBottom: '0px' }}
                  />
                </li>
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}

PhotosView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default PhotosView

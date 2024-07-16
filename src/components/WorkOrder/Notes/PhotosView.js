import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import NotesForm from './NotesForm'
import NotesTimeline from './NotesTimeline'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { sortObjectsByDateKey } from '@/utils/date'
import { format } from 'date-fns'
// import PhotoSwipeLightbox from '/photoswipe/photoswipe-lightbox.esm.js'
// import PhotoSwipe from '/photoswipe/photoswipe.esm.js'
// const FormData = require('form-data')
// const fs = require('fs')

import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
// import { Button } from 'lbh-frontend'
import { PrimarySubmitButton } from '../../Form'
import { filesize } from 'filesize'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'

const PhotosView = ({ workOrderReference, tabName }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [displayForm, setDisplayForm] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    console.log('onDrop', { acceptedFiles })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // const onFormSubmit = async (formData) => {
  //   setLoading(true)

  //   try {
  //     await frontEndApiRequest({
  //       method: 'post',
  //       path: `/api/jobStatusUpdate`,
  //       requestData: formData,
  //     })
  //     setDisplayForm(false)
  //     getPhotosView(workOrderReference)
  //   } catch (e) {
  //     console.error(e)
  //     setError(
  //       `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
  //     )
  //   }

  //   setLoading(false)
  // }

  // const showForm = (e) => {
  //   e.preventDefault()

  //   setDisplayForm(true)
  // }

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

    // const input = document.getElementById(`file-upload`)
    // input.addEventListener('change', previewPhoto)

    // const previewPhoto = () => {

    //   console.log("preview photo")

    //   const file = input.files
    //   if (file) {
    //     const fileReader = new FileReader()
    //     const preview = document.getElementById('file-preview')
    //     fileReader.onload = (event) => {
    //       preview.setAttribute('src', event.target.result)
    //     }
    //     fileReader.readAsDataURL(file[0])
    //   }
    // }
  }, [])

  const [files, setFiles] = useState([])

  useEffect(() => {
    console.log({ files })
  }, [files])

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('submit', { files })

    const formdata = new FormData()
    // formdata.append('files', files[0], '/C:/Users/Callum/Downloads/pollen.jpg')

    files.forEach((file) => {
      formdata.append('files', file)
      // formdata.append('files', file, '/C:/Users/Callum/Downloads/image (1).png')
    })

    // formdata.append('files', files[0], files[0].name)

    formdata.append('workOrderId', workOrderReference)

    // frontEndApiRequest({
    //   method: 'post',
    //   path: `/api/workOrders/images`,
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   },
    //   requestData: formdata,
    // }).then((res) => {
    //   console.log({ res })
    // })

    // console.log({ boundary: formdata.getAll() })

    axios({
      method: 'post',
      url: `/api/workOrders/images`,
      // params: params,
      headers: {
        // 'Content-Type': 'multipart/form-data',
      },
      data: formdata,
      // ...(requestData && { data: requestData }),
      // ...(paramsSerializer && { paramsSerializer }),
    })
  }

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
            <div
              style={
                {
                  // border: '4px dashed #ddd',
                  // padding: '15px',
                }
              }
            >
              <div class="govuk-form-group">
                <label
                  class="govuk-label"
                  for="file-upload-1"
                  style={{ marginTop: '10px' }}
                >
                  Upload a photo (maximum 10)
                </label>
                <input
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

                      {/* <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: "150px"
                        }}
                      > */}
                      {/* <p
                        style={{
                          flexShrink: '1',
                          flexGrow: '0',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        }}
                      >
                        {x.name}
                      </p> */}
                      {/* <p>{filesize(x.size, { standard: 'jedec' })}</p> */}
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
                      {/* </div> */}
                      {/* <p
                        style={{
                          background: '#eee',
                          padding: '5px 10px',
                        }}
                      >
                        {x.name} ({filesize(x.size, { standard: 'jedec' })})
                      </p> */}
                    </div>
                  ))}
                </div>

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

          {/* <NotesForm
            onFormSubmit={onFormSubmit}
            tabName={tabName}
            workOrderReference={workOrderReference}
            displayForm={displayForm}
            showForm={showForm}
          />
          {notes && <NotesTimeline notes={notes} />}
          {error && <ErrorMessage label={error} />} */}
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

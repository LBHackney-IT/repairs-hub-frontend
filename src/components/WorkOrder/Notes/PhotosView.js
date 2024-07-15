import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
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

const PhotosView = ({ workOrderReference, tabName }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [displayForm, setDisplayForm] = useState(false)

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

          <form onSubmit={handleSubmit}>
            <div
              style={{
                border: '4px dashed #ddd',
                padding: '15px',
              }}
            >
              <div class="govuk-form-group">
                <label class="govuk-label" for="file-upload-1">
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
                  // value={}
                  onInput={(e) => {
                    console.log(Object.values(e.target.files))
                    setFiles(Object.values(e.target.files))

                    // const filesArray = []
                  }}
                />

                <div style={{ display: 'flex' }}>
                  {files.map((x) => (
                    <div>
                      <img
                        style={{ height: '150px', width: 'auto' }}
                        src={URL.createObjectURL(x)}
                        alt="Preview Uploaded Image"
                        id="file-preview"
                      />
                      <p
                        style={{
                          background: '#eee',
                          padding: '5px 10px',
                        }}
                      >
                        {x.name} ({filesize(x.size, { standard: 'jedec' })})
                      </p>
                    </div>
                  ))}
                </div>

                <PrimarySubmitButton label="Upload">Upload</PrimarySubmitButton>
              </div>
            </div>
          </form>

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
                    borderBottom: '2px solid grey',
                    marginBottom: '15px',
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

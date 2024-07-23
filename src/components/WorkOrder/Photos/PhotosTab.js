import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import UploadPhotosForm from './UploadPhotosForm'
import PhotoViewList from './PhotoViewList'

const PhotosTab = ({ workOrderReference }) => {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPhotos = async (workOrderReference) => {
    setError(null)

    try {
      const photos = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/images/${workOrderReference}`,
      })

      setPhotos(photos)
    } catch (e) {
      setPhotos(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setIsLoading(false)
  }

  const onSubmitSetDescription = async (requestData) => {
    setIsLoading(true)

    try {
      await frontEndApiRequest({
        method: 'patch',
        path: `/api/workOrders/images/fileGroup`,
        requestData,
      })

      getPhotos(workOrderReference)
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)

    getPhotos(workOrderReference)
  }, [])

  if (isLoading) return <Spinner />

  return (
    <>
      <h2>Photos</h2>

      {error && <ErrorMessage label={error} />}

      <UploadPhotosForm
        workOrderReference={workOrderReference}
        onSuccess={() => {
          // reload photos
          getPhotos(workOrderReference)
        }}
      />

      <PhotoViewList
        photos={photos}
        onSubmitSetDescription={onSubmitSetDescription}
      />
    </>
  )
}

PhotosTab.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default PhotosTab

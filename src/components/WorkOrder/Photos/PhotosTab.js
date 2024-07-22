import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import UploadPhotosForm from './UploadPhotosForm'
import PhotoViewList from './PhotoViewList'

const PhotosTab = ({ workOrderReference }) => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
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

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getPhotos(workOrderReference)
  }, [])

  if (loading) return <Spinner />

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

      <PhotoViewList photos={photos} />
    </>
  )
}

PhotosTab.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default PhotosTab

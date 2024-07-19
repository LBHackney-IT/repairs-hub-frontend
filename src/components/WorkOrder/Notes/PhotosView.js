import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import UploadPhotosForm from './UploadPhotosForm'
import PhotoViewList from './PhotoViewList'

const PhotosView = ({ workOrderReference }) => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getPhotosView = async (workOrderReference) => {
    setError(null)

    try {
      const images = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/images/${workOrderReference}`,
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

  if (loading) return <Spinner />

  return (
    <>
      <h2>Photos</h2>

      {error && <ErrorMessage label={error} />}

      <UploadPhotosForm
        workOrderReference={workOrderReference}
        onSuccess={() => {
          // reload photos
          getPhotosView(workOrderReference)
        }}
      />

      <PhotoViewList images={images} />
    </>
  )
}

PhotosView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default PhotosView

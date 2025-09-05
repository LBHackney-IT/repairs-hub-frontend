import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import UploadPhotosForm from './UploadPhotosForm'
import PhotoViewList from './PhotoViewList'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'
import { clearIndexedDb } from './hooks/uploadFiles/cacheFile'

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
      setError(formatRequestErrorMessage(e))
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
      setError(formatRequestErrorMessage(e))
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)

    getPhotos(workOrderReference)
  }, [])

  if (isLoading) return <Spinner />

  return (
    <div className="photos-tab">
      <h2 className="lbh-heading-h2">Photos</h2>

      {error && <ErrorMessage label={error} />}

      <span className="photos-tab-upload">
        <UploadPhotosForm
          workOrderReference={workOrderReference}
          onSuccess={async () => {
            // reload photos
            getPhotos(workOrderReference)
            await clearIndexedDb()
          }}
        />
      </span>

      <PhotoViewList
        photos={photos}
        onSubmitSetDescription={onSubmitSetDescription}
      />
    </div>
  )
}

PhotosTab.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
}

export default PhotosTab

import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import UploadPhotosForm from './UploadPhotosForm'
import PhotoViewList from './PhotoViewList'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'
import { clearIndexedDb } from './hooks/uploadFiles/cacheFile'
import {
  fetchWorkOrderPhotosRequest,
  updatePhotoFileGroupRequest,
} from '@/requests/photos'

interface Props {
  workOrderReference: string
  tabName: string
}

const PhotosTab = ({ workOrderReference, tabName }: Props) => {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPhotos = async (workOrderReference) => {
    setError(null)

    try {
      const photos = await fetchWorkOrderPhotosRequest(workOrderReference)

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
      await updatePhotoFileGroupRequest(requestData)

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

  if (isLoading)
    return (
      <>
        <h2 className="lbh-heading-h2">{tabName}</h2>
        <Spinner />
      </>
    )

  return (
    <div className="photos-tab">
      <h2 className="lbh-heading-h2">{tabName}</h2>

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

export default PhotosTab

import { useState } from 'react'
import ConfirmCloseWorkOrderWithoutPhotosForm from '../ConfirmCloseWorkOrderWithoutPhotosForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

import Spinner from '../../Spinner'
import { useRouter } from 'next/router'
import ErrorMessage from '../../Errors/ErrorMessage'

interface Props {
  workOrderId: string
}

const ConfirmCloseWorkOrderView = (props: Props) => {
  const { workOrderId } = props

  const [loadingStatus, setLoadingStatus] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)

  const router = useRouter()

  const handleSkip = () => {
    router.push('/')
  }

  const buildRequestObject = (data: { reason: string; comments: string }) => {
    const requestData = {
      uploadWasTakingTooLong: false,
      uploadFailed: false,
      photosWereNotNecessary: false,
      comments: data.comments,
      workOrderId: workOrderId,
    }

    if (data.reason !== 'other') {
      requestData[data.reason] = true
    }

    return requestData
  }

  const handleSubmit = (data: { reason: string; comments: string }) => {
    if (loadingStatus !== null) return

    const requestData = buildRequestObject(data)

    setRequestError(null)
    setLoadingStatus('Submitting feedback')

    frontEndApiRequest({
      method: 'post',
      path: '/api/feedback/close-work-order-without-photo',
      requestData,
    })
      .then(() => {
        // dont turn off loading
        // to hide screen flash
        router.push('/')
      })
      .catch((err) => {
        console.error(err)
        setRequestError(err.message)

        setLoadingStatus(null)
      })
  }

  if (loadingStatus)
    return (
      <div
        className="govuk-body"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Spinner />
        <span style={{ margin: '0 0 0 15px' }}>{loadingStatus}</span>
      </div>
    )

  return (
    <div>
      <div className="govuk-panel govuk-panel--confirmation lbh-panel">
        <h1 className="govuk-panel__title">
          Work order {workOrderId} successfully closed with{' '}
          <strong>reason for closing</strong>
        </h1>
        {/* <div class="govuk-panel__body">Your reference number: HDJ2123F</div> */}
      </div>

      <ConfirmCloseWorkOrderWithoutPhotosForm
        onSkip={handleSkip}
        onSubmit={handleSubmit}
      />

      {requestError && <ErrorMessage label={requestError} />}
    </div>
  )
}

export default ConfirmCloseWorkOrderView

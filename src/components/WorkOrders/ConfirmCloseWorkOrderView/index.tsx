import { useEffect, useState } from 'react'
import ConfirmCloseWorkOrderWithoutPhotosForm from '../ConfirmCloseWorkOrderWithoutPhotosForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'

import { useRouter } from 'next/router'
import ErrorMessage from '../../Errors/ErrorMessage'
import SpinnerWithLabel from '../../SpinnerWithLabel'
import { getWorkOrderDetails } from '@/root/src/utils/requests/workOrders'
import { ApiResponseType } from '@/root/src/types/requests/types'
import { WorkOrder } from '@/root/src/models/workOrder'

interface Props {
  workOrderId: string
}

const ConfirmCloseWorkOrderView = (props: Props) => {
  const { workOrderId } = props

  const [loadingStatus, setLoadingStatus] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)

  const [workOrder, setWorkOrder] = useState<{
    status: string
  } | null>(null)

  const router = useRouter()

  useEffect(() => {
    loadWorkOrder()
  }, [])

  const loadWorkOrder = async () => {
    setLoadingStatus('Fetching work order data')

    const workOrderResponse: ApiResponseType<WorkOrder> =
      await getWorkOrderDetails(workOrderId)

    if (workOrderResponse.success) {
      setWorkOrder(workOrderResponse?.response)
    } else {
      setRequestError(workOrderResponse.error.message)
    }

    setLoadingStatus(null)
  }

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
        setRequestError(err.message)
        setLoadingStatus(null)
      })
  }

  if (loadingStatus) return <SpinnerWithLabel label={loadingStatus} />

  return (
    <div>
      <div className="govuk-panel govuk-panel--confirmation lbh-panel">
        <h1 className="govuk-panel__title">
          Work order {workOrderId} successfully{' '}
          {workOrder?.status === 'No Access'
            ? 'closed with no access'
            : 'closed'}
        </h1>
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

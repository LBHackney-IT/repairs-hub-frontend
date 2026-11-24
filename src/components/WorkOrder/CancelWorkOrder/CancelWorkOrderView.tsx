import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import CancelWorkOrderForm from './CancelWorkOrderForm'
import SuccessPage from '../../SuccessPage/index'
import { cancelWorkOrderLinks } from '@/utils/successPageLinks'
import Panel from '@/components/Template/Panel'
import {
  completeWorkOrderRequest,
  getWorkOrderDetailsRequest,
} from '@/requests/workOrders'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

interface Props {
  workOrderReference: string
}

const CancelWorkOrderView = ({ workOrderReference }: Props) => {
  const [workOrder, setWorkOrder] = useState<any>({})
  const [formSuccess, setFormSuccess] = useState(false)
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState(false)

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      await completeWorkOrderRequest(formData)
      setFormSuccess(true)
    } catch (e) {
      console.error(e)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const getCancelWorkOrderView = async () => {
    setError(null)

    const workOrderResponse = await getWorkOrderDetailsRequest(
      workOrderReference
    )

    if (!workOrderResponse.success) {
      setWorkOrder(null)
      setError(workOrderResponse.error.message)
    } else {
      setWorkOrder(workOrderResponse.response)
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getCancelWorkOrderView()
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {formSuccess && workOrder && (
            <SuccessPage
              banner={
                <Panel
                  title="Work order cancelled"
                  workOrderReference={workOrderReference}
                />
              }
              links={cancelWorkOrderLinks(
                workOrderReference,
                workOrder.propertyReference,
                workOrder.property
              )}
            />
          )}
          {!formSuccess && workOrder && (
            <CancelWorkOrderForm
              workOrder={workOrder}
              onFormSubmit={onFormSubmit}
            />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default CancelWorkOrderView

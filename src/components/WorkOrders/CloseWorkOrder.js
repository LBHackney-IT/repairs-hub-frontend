import PropTypes from 'prop-types'
import CloseWorkOrderForm from './CloseWorkOrderForm'
import { useState, useEffect, useContext } from 'react'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { useRouter } from 'next/router'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { WorkOrder } from '../../models/workOrder'
import { buildCloseWorkOrderData } from '../../utils/hact/workOrderComplete/closeWorkOrder'
import FlashMessageContext from '../FlashMessageContext/FlashMessageContext'

const CloseWorkOrder = ({ reference }) => {
  const router = useRouter()

  const { setModalFlashMessage } = useContext(FlashMessageContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const [workOrder, setWorkOrder] = useState()

  const makePostRequest = async (workOrderCompleteFormData, reason) => {
    setLoading(true)

    try {
      frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: workOrderCompleteFormData,
      })

      setModalFlashMessage(
        `Work order ${reference} successfully ${
          reason === 'No Access' ? 'closed with no access' : 'completed'
        }`
      )

      router.push('/')
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
      setLoading(false)
    }
  }

  const getCloseWorkOrder = async () => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${reference}`,
      })
      setWorkOrder(new WorkOrder(workOrder))
    } catch (e) {
      setWorkOrder(null)

      console.error('An error has occured:', e.response)

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getCloseWorkOrder()
  }, [])

  const onSubmit = async (data) => {
    const closeWorkOrderFormData = buildCloseWorkOrderData(
      new Date().toISOString(),
      data.notes,
      reference,
      data.reason
    )

    makePostRequest(closeWorkOrderFormData, data.reason)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!workOrder && error && <ErrorMessage label={error} />}

          {workOrder && (
            <>
              {
                <CloseWorkOrderForm
                  reference={workOrder.reference}
                  onSubmit={onSubmit}
                />
              }
              {error && <ErrorMessage label={error} />}
            </>
          )}
        </>
      )}
    </>
  )
}

CloseWorkOrder.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default CloseWorkOrder

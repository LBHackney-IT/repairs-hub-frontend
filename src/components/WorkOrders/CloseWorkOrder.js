import PropTypes from 'prop-types'
import CloseWorkOrderForm from './CloseWorkOrderForm'
import { useState, useEffect } from 'react'
import Spinner from '../Spinner/Spinner'
import ErrorMessage from '../Errors/ErrorMessage/ErrorMessage'
import { useRouter } from 'next/router'
import { frontEndApiRequest } from '../../utils/frontEndApiClient/requests'
import { WorkOrder } from '../../models/workOrder'
import { buildCloseWorkOrderData } from '../../utils/hact/workOrderComplete/closeWorkOrder'
import Cookies from 'universal-cookie'

const CloseWorkOrder = ({ reference }) => {
  const router = useRouter()

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

      const cookies = new Cookies()

      cookies.set(
        process.env.NEXT_PUBLIC_WORK_ORDER_SESSION_COOKIE_NAME,
        JSON.stringify({ id: reference, reason: reason }),
        {
          path: '/',
          maxAge: 60 * 5, // 5 minutes
        }
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

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import CancelWorkOrderForm from './CancelWorkOrderForm'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import SuccessPage from '../../SuccessPage/index'

const CancelWorkOrderView = ({ workOrderReference }) => {
  const [workOrder, setWorkOrder] = useState({})
  const [formSuccess, setFormSuccess] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: formData,
      })
      setFormSuccess(true)
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const getCancelWorkOrderView = async () => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
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

    getCancelWorkOrderView(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {formSuccess && workOrder && (
            <SuccessPage
              workOrderReference={workOrderReference}
              propertyReference={workOrder.propertyReference}
              shortAddress={workOrder.property}
              raiseNewRepair={true}
              showSearchLink={true}
              action="cancel"
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

CancelWorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default CancelWorkOrderView

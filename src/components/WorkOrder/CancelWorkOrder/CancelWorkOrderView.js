import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import CancelWorkOrderForm from './CancelWorkOrderForm'
import CancelWorkOrderFormSuccess from './CancelWorkOrderFormSuccess'
import { getRepair } from '../../../utils/frontend-api-client/repairs'
import { postWorkOrderComplete } from '../../../utils/frontend-api-client/work-order-complete'

const CancelWorkOrderView = ({ workOrderReference }) => {
  const [workOrder, setWorkOrder] = useState({})
  const [formSuccess, setFormSuccess] = useState(false)
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      await postWorkOrderComplete(formData)
      setFormSuccess(true)
    } catch (e) {
      console.log(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
      )
    }

    setLoading(false)
  }

  const getCancelWorkOrderView = async () => {
    setError(null)

    try {
      const workOrder = await getRepair(workOrderReference)

      setWorkOrder(workOrder)
    } catch (e) {
      setWorkOrder(null)
      console.log('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status}`
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
            <CancelWorkOrderFormSuccess
              workOrderReference={workOrderReference}
              propertyReference={workOrder.propertyReference}
              shortAddress={workOrder.property}
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

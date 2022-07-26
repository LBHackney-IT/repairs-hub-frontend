import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { sortObjectsByDateKey } from '@/utils/date'
import MobileWorkingWorkOrder from './MobileWorkingWorkOrder'
import { buildVariationFormData } from '@/utils/hact/jobStatusUpdate/variation'
import router from 'next/router'
import { buildCloseWorkOrderData } from '@/utils/hact/workOrderComplete/closeWorkOrder'
import MobileWorkingCloseWorkOrderForm from '@/components/WorkOrders/MobileWorkingCloseWorkOrderForm'
import FlashMessageContext from '@/components/FlashMessageContext'
import {
  BONUS_PAYMENT_TYPE,
  workOrderNoteFragmentForPaymentType,
} from '@/utils/paymentTypes'

const MobileWorkingWorkOrderView = ({ workOrderReference }) => {
  const { setModalFlashMessage } = useContext(FlashMessageContext)

  const [property, setProperty] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [tenure, setTenure] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const [paymentType, setPaymentType] = useState(BONUS_PAYMENT_TYPE)
  const [workOrderProgressedToClose, setWorkOrderProgressedToClose] = useState(
    false
  )

  const getWorkOrderView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrder = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })
      const propertyObject = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${workOrder.propertyReference}`,
      })

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })

      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setCurrentUser(currentUser)

      setTasksAndSors(
        sortObjectsByDateKey(tasksAndSors, ['dateAdded'], 'dateAdded')
      )

      setWorkOrder(new WorkOrder(workOrder))
      setProperty(propertyObject.property)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
    } catch (e) {
      setWorkOrder(null)
      setProperty(null)
      console.error('An error has occured:', e.response)

      if (e.response?.status === 404) {
        setError(
          `Could not find a work order with reference ${workOrderReference}`
        )
      } else {
        setError(
          `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
        )
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getWorkOrderView(workOrderReference)
  }, [])

  const onWorkOrderProgressToCloseSubmit = async (formData) => {
    try {
      if (formData.variationReason) {
        await frontEndApiRequest({
          method: 'post',
          path: `/api/jobStatusUpdate`,
          requestData: buildVariationFormData(
            tasksAndSors,
            [],
            workOrderReference,
            formData.variationReason
          ),
        })
      }

      formData.paymentType && setPaymentType(formData.paymentType)
      setWorkOrderProgressedToClose(true)
    } catch (e) {
      console.error(e)

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }
  }

  const onWorkOrderCompleteSubmit = async (data) => {
    const closeWorkOrderFormData = buildCloseWorkOrderData(
      new Date().toISOString(),
      [data.notes, workOrderNoteFragmentForPaymentType(paymentType)].join(
        ' - '
      ),
      workOrderReference,
      data.reason,
      paymentType
    )

    setLoading(true)

    try {
      await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: closeWorkOrderFormData,
      })

      setModalFlashMessage(
        `Work order ${workOrderReference} successfully ${
          data.reason === 'No Access' ? 'closed with no access' : 'completed'
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!workOrderProgressedToClose &&
            property &&
            property.address &&
            property.hierarchyType &&
            tenure &&
            workOrder && (
              <>
                <MobileWorkingWorkOrder
                  workOrderReference={workOrderReference}
                  property={property}
                  tenure={tenure}
                  workOrder={workOrder}
                  tasksAndSors={tasksAndSors}
                  error={error}
                  onFormSubmit={onWorkOrderProgressToCloseSubmit}
                  currentUserPayrollNumber={currentUser.operativePayrollNumber}
                  paymentType={paymentType}
                />
              </>
            )}

          {workOrderProgressedToClose && (
            <MobileWorkingCloseWorkOrderForm
              onSubmit={onWorkOrderCompleteSubmit}
            />
          )}

          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

MobileWorkingWorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default MobileWorkingWorkOrderView

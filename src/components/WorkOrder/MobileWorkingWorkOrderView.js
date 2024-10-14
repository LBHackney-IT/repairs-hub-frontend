import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import {
  fetchSimpleFeatureToggles,
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { sortObjectsByDateKey } from '@/utils/date'
import MobileWorkingWorkOrder from './MobileWorkingWorkOrder'
import { buildVariationFormData } from '@/utils/hact/jobStatusUpdate/variation'
import router from 'next/router'
import {
  buildCloseWorkOrderData,
  buildFollowOnRequestData,
} from '@/utils/hact/workOrderComplete/closeWorkOrder'
import MobileWorkingCloseWorkOrderForm from '@/components/WorkOrders/MobileWorkingCloseWorkOrderForm'
import FlashMessageContext from '@/components/FlashMessageContext'
import { BONUS_PAYMENT_TYPE } from '@/utils/paymentTypes'
import { FOLLOW_ON_REQUEST_AVAILABLE_TRADES } from '../../utils/statusCodes'
import uploadFiles from './Photos/hooks/uploadFiles'
import { workOrderNoteFragmentForPaymentType } from '../../utils/paymentTypes'
import SpinnerWithLabel from '../SpinnerWithLabel'

const MobileWorkingWorkOrderView = ({ workOrderReference, operativeId }) => {
  const { setModalFlashMessage } = useContext(FlashMessageContext)

  const [property, setProperty] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [tenure, setTenure] = useState({})
  const [photos, setPhotos] = useState([])
  const [featureToggles, setFeatureToggles] = useState({})

  const [loadingStatus, setLoadingStatus] = useState(null)
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

      const featureToggleData = await fetchSimpleFeatureToggles()

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

      const photos = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/images/${workOrderReference}`,
      })

      setFeatureToggles(featureToggleData)
      setPhotos(photos)
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
      setPhotos(null)
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

    setLoadingStatus(null)
  }

  useEffect(() => {
    setLoadingStatus('Loading workorder')

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

  const onWorkOrderCompleteSubmit = async (data, files) => {
    setLoadingStatus('Completing workorder')

    let followOnRequest = null

    if (data.followOnStatus === 'furtherWorkRequired') {
      const requiredFollowOnTrades = []

      if (data.isDifferentTrades) {
        FOLLOW_ON_REQUEST_AVAILABLE_TRADES.forEach(({ name, value }) => {
          if (data[name]) requiredFollowOnTrades.push(value)
        })
      }

      followOnRequest = buildFollowOnRequestData(
        data.isSameTrade,
        data.isDifferentTrades,
        data.isMultipleOperatives,
        requiredFollowOnTrades,
        data.followOnTypeDescription,
        data.stockItemsRequired,
        data.nonStockItemsRequired,
        data.materialNotes,
        data.additionalNotes
      )
    }

    const followOnFunctionalityEnabled =
      featureToggles?.followOnFunctionalityEnabled ?? false

    let notes = data.notes // notes written by user

    if (data.reason == 'No Access' || !followOnFunctionalityEnabled) {
      notes = [
        'Work order closed',
        data.notes,
        workOrderNoteFragmentForPaymentType(paymentType),
      ].join(' - ')
    }

    const closeWorkOrderFormData = buildCloseWorkOrderData(
      new Date().toISOString(),
      notes,
      workOrderReference,
      data.reason,
      paymentType,
      followOnFunctionalityEnabled,
      followOnRequest
    )

    try {
      if (files.length > 0) {
        const description = data.description

        const uploadResult = await uploadFiles(
          files,
          workOrderReference,
          'Closing work order',
          description,
          (value) => setLoadingStatus(value)
        )

        if (!uploadResult.success) throw uploadResult.requestError

        setLoadingStatus('Completing workorder')
      }

      await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: closeWorkOrderFormData,
      })

      if (files.length === 0) {
        // confirmation page with form
        router.push(
          `/operatives/${operativeId}/work-orders/${workOrderReference}/confirmation`
        )
      } else {
        // pre-existing confirmation message
        setModalFlashMessage(
          `Work order ${workOrderReference} successfully ${
            data.reason === 'No Access' ? 'closed with no access' : 'closed'
          }`
        )
        router.push('/')
      }
    } catch (e) {
      console.error(e)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
      setLoadingStatus(null)
    }
  }

  if (loadingStatus) return <SpinnerWithLabel label={loadingStatus} />

  return (
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
              photos={photos}
            />
          </>
        )}

      {workOrderProgressedToClose && (
        <MobileWorkingCloseWorkOrderForm
          onSubmit={onWorkOrderCompleteSubmit}
          isLoading={loadingStatus !== null}
          followOnFunctionalityEnabled={
            featureToggles?.followOnFunctionalityEnabled ?? false
          }
        />
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

MobileWorkingWorkOrderView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
}

export default MobileWorkingWorkOrderView

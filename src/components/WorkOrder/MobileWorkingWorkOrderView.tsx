import { useState, useEffect, useContext } from 'react'
import ErrorMessage from '../Errors/ErrorMessage'
import {
  fetchSimpleFeatureToggles,
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/models/workOrder'
import { sortObjectsByDateKey } from '@/utils/date'
import MobileWorkingWorkOrder from './MobileWorkingWorkOrder'
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
import { emitTagManagerEvent } from '@/utils/tagManager'
import { APIResponseError } from '../../types/requests/types'
import { buildVariationFormData } from '../../utils/hact/jobStatusUpdate/variation'
import { formatRequestErrorMessage } from '../../utils/errorHandling/formatErrorMessage'
import {
  getAppointmentDetails,
  getWorkOrderDetails,
} from '../../utils/requests/workOrders'
import { CurrentUser } from '../../types/variations/types'
import { Property, Tenure } from '../../models/propertyTenure'
import { SimpleFeatureToggleResponse } from '../../pages/api/simple-feature-toggle'
import { WorkOrderAppointmentDetails } from '../../models/workOrderAppointmentDetails'
import { clearIndexedDb } from './Photos/hooks/uploadFiles/cacheFile'

interface Props {
  workOrderReference: string
}

const MobileWorkingWorkOrderView = ({ workOrderReference }: Props) => {
  const { setModalFlashMessage } = useContext(FlashMessageContext)

  const [property, setProperty] = useState<Property>()
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [workOrder, setWorkOrder] = useState<WorkOrder>()
  const [
    appointmentDetails,
    setAppointmentDetails,
  ] = useState<WorkOrderAppointmentDetails>()
  const [tasksAndSors, setTasksAndSors] = useState([])
  const [tenure, setTenure] = useState<Tenure>()
  const [photos, setPhotos] = useState([])

  const [
    featureToggles,
    setFeatureToggles,
  ] = useState<SimpleFeatureToggleResponse>()

  const [loadingStatus, setLoadingStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>()

  const [paymentType, setPaymentType] = useState(BONUS_PAYMENT_TYPE)
  const [workOrderProgressedToClose, setWorkOrderProgressedToClose] = useState(
    false
  )
  const [closeFormValues, setCloseFormValues] = useState({})

  const getWorkOrderView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderResponse = await getWorkOrderDetails(workOrderReference)
      if (!workOrderResponse.success) throw workOrderResponse.error

      const workOrder = workOrderResponse.response

      const appointmentDetailsResponse = await getAppointmentDetails(
        workOrderReference
      )
      if (!appointmentDetailsResponse.success)
        throw appointmentDetailsResponse.error

      const appointmentDetails = appointmentDetailsResponse.response

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
      setAppointmentDetails(new WorkOrderAppointmentDetails(appointmentDetails))
      setProperty(propertyObject.property)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
    } catch (e) {
      setWorkOrder(null)
      setAppointmentDetails(null)
      setProperty(null)
      setPhotos(null)
      console.error('An error has occured:', e.response)

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        if (e.response?.status === 404) {
          setError(
            `Could not find a work order with reference ${workOrderReference}`
          )
        } else {
          setError(formatRequestErrorMessage(e))
        }
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

      setError(formatRequestErrorMessage(e))
    }
  }

  const onWorkOrderCompleteSubmit = async (
    data,
    workOrderFiles,
    followOnFiles
  ) => {
    setLoadingStatus('Completing workorder')

    let followOnRequest = null

    if (data.followOnStatus === 'furtherWorkRequired') {
      const requiredFollowOnTrades = []

      FOLLOW_ON_REQUEST_AVAILABLE_TRADES.forEach(({ name, value }) => {
        if (data[name]) requiredFollowOnTrades.push(value)
      })

      followOnRequest = buildFollowOnRequestData(
        data.isEmergency === 'true',
        data.isMultipleOperatives === 'true',
        requiredFollowOnTrades,
        data.followOnTypeDescription,
        data.stockItemsRequired,
        data.nonStockItemsRequired,
        data.materialNotes,
        data.additionalNotes,
        data.supervisorCalled === 'Yes',
        data.otherTrade
      )
    } else {
      // Do not upload follow on files if user removed follow-on request
      followOnFiles = []
    }

    let notes = data.notes // notes written by user

    if (data.reason == 'No Access') {
      notes = [
        'Work order closed',
        data.notes,
        workOrderNoteFragmentForPaymentType(paymentType),
      ].join(' - ')
    }

    const closeWorkOrderFormData = buildCloseWorkOrderData(
      new Date(),
      notes,
      workOrderReference,
      data.reason,
      paymentType,
      followOnRequest
    )

    try {
      const filesToUpload = workOrderFiles.concat(followOnFiles)
      setCloseFormValues({
        workOrderFiles: workOrderFiles,
        followOnFiles: followOnFiles,
      })

      if (filesToUpload.length > 0) {
        if (workOrderFiles.length > 0) {
          const uploadResult = await uploadFiles(
            workOrderFiles,
            workOrderReference,
            data.workOrderPhotoDescription,
            'Closing work order',
            setLoadingStatus
          )

          if (!uploadResult.success) {
            setError(uploadResult.requestError)
            setLoadingStatus(null)
            return
          }
        }

        if (followOnFiles.length > 0) {
          const uploadResult = await uploadFiles(
            followOnFiles,
            workOrderReference,
            data.followOnPhotoDescription,
            'Raising a follow on',
            setLoadingStatus
          )

          if (!uploadResult.success) {
            setError(uploadResult.requestError)
            setLoadingStatus(null)
            return
          }
        }
      }

      setLoadingStatus('Completing workorder')
      await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrderComplete`,
        requestData: closeWorkOrderFormData,
      })

      const isNoAccess = data.reason === 'No Access'

      if (featureToggles?.googleTagManagerEnabled)
        emitTagManagerEvent({
          event: 'work-order-closed',
          workOrderClosedDetails: {
            visitCompleted: !isNoAccess,
            photosUploaded: workOrderFiles?.length > 0,
            followOnRequested: followOnRequest !== null,
            followOnPhotosUploaded: followOnFiles?.length > 0,
          },
        })

      setModalFlashMessage(
        `Work order ${workOrderReference} successfully ${
          isNoAccess ? 'closed with no access' : 'closed'
        }`
      )
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('closeWorkOrder')) {
          localStorage.removeItem(key)
        }
      } // Clear cached form data
      setCloseFormValues(null)
      await clearIndexedDb()
      router.push('/')
    } catch (e) {
      console.error(e)
      setError(formatRequestErrorMessage(e))
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
        workOrder && (
          <>
            <MobileWorkingWorkOrder
              workOrderReference={workOrderReference}
              property={property}
              tenure={tenure}
              workOrder={workOrder}
              appointmentDetails={appointmentDetails}
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
          workOrderReference={workOrderReference}
          onSubmit={onWorkOrderCompleteSubmit}
          isLoading={loadingStatus !== null}
          presetValues={closeFormValues}
        />
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default MobileWorkingWorkOrderView

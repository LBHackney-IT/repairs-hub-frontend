import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { beginningOfDay, beginningOfWeek, daysAfter } from '@/utils/time'
import BackButton from '../../Layout/BackButton'
import PropertyDetails from './PropertyDetails'
import WorkOrderTasks from './WorkOrderTasks'
import AppointmentCalendar from './AppointmentCalendar'
import SuccessPage from '@/components/SuccessPage/index'
import Panel from '../../Template/Panel'
import NoAvailableAppointments from './NoAvailableAppointments'
import { toISODate } from '../../../utils/date'
import { createWOLinks } from '@/utils/successPageLinks'
import {
  fetchWorkOrderTasksRequest,
  getWorkOrderDetailsRequest,
} from '@/requests/workOrders'
import { APIResponseError } from '@/root/src/types/requests/types'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'
import { fetchPropertyTenureRequest } from '@/requests/property'
import {
  createAppointmentRequest,
  fetchAvailableAppointmentsRequest,
} from '@/requests/appointments'
import { postJobStatusUpdateRequest } from '@/requests/jobStatusUpdate'

interface Props {
  workOrderReference: string
  successText?: string
}

const AppointmentView = ({ workOrderReference, successText }: Props) => {
  const [property, setProperty] = useState<any>({})

  const [workOrder, setWorkOrder] = useState<any>({})

  const [tenure, setTenure] = useState<any>({})
  const [tasksAndSors, setTasksAndSors] = useState<any>({})
  const [availableAppointments, setAvailableAppointments] = useState([])
  const [comments, setComments] = useState('')
  const [dateSelected, setDateSelected] = useState('')
  const [slot, setSlot] = useState('')
  const [scheduleAppointmentSuccess, setScheduleAppointmentSuccess] = useState(
    false
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>()

  const getAppointmentView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderResponse = await getWorkOrderDetailsRequest(
        workOrderReference
      )

      if (!workOrderResponse.success) {
        throw workOrderResponse.error
      }

      const workOrder = workOrderResponse.response

      if (!workOrder.statusAllowsScheduling()) {
        setError(
          'Appointment scheduling for closed or authorisation pending work orders is not permitted'
        )
        return
      }

      const tasksAndSors = await fetchWorkOrderTasksRequest(workOrderReference)
      const propertyObject = await fetchPropertyTenureRequest(
        workOrder.propertyReference
      )
      const currentDate = beginningOfDay(new Date())
      const startOfCalendar = beginningOfWeek(currentDate)
      const endOfCalendar = daysAfter(startOfCalendar, 41)

      const availableAppointments = await fetchAvailableAppointmentsRequest({
        workOrderReference: workOrderReference,
        fromDate: toISODate(startOfCalendar),
        toDate: toISODate(endOfCalendar),
      })

      setWorkOrder(workOrder)
      setTasksAndSors(tasksAndSors)

      setProperty(propertyObject.property)

      if (propertyObject.tenure) setTenure(propertyObject.tenure)
      setAvailableAppointments(availableAppointments)
    } catch (e) {
      setWorkOrder(null)
      setTasksAndSors(null)
      setProperty(null)
      setTenure(null)
      setAvailableAppointments(null)
      console.error('An error has occured:', e.response)

      if (e instanceof APIResponseError) {
        setError(e.message)
      } else {
        setError(formatRequestErrorMessage(e))
      }
    } finally {
      setLoading(false)
    }
  }

  const makePostRequest = async (
    formData,
    comments,
    dateSelected,
    slot,
    commentsForJobStatus
  ) => {
    setComments(comments)
    setDateSelected(dateSelected)
    setSlot(slot)

    setLoading(true)

    try {
      await createAppointmentRequest(formData).then(() =>
        postJobStatusUpdateRequest(commentsForJobStatus)
      )
      setScheduleAppointmentSuccess(true)
    } catch (e) {
      console.error(e)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getAppointmentView(workOrderReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!scheduleAppointmentSuccess && <BackButton />}
          {property &&
            property.address &&
            property.hierarchyType &&
            tenure &&
            workOrder &&
            !scheduleAppointmentSuccess && (
              <>
                <PropertyDetails
                  address={property.address}
                  boilerHouseId={property.boilerHouseId}
                  tenure={tenure}
                  subTypeDescription={property.hierarchyType.subTypeDescription}
                  canRaiseRepair={property.canRaiseRepair}
                  propertyReference={property.propertyReference}
                />
                <WorkOrderTasks tasks={tasksAndSors} />
                {!availableAppointments.length ? (
                  <NoAvailableAppointments
                    workOrderReference={workOrderReference}
                  />
                ) : (
                  <AppointmentCalendar
                    availableAppointments={availableAppointments}
                    workOrderReference={workOrderReference}
                    makePostRequest={makePostRequest}
                  />
                )}
              </>
            )}
          {error && <ErrorMessage label={error} />}
          {scheduleAppointmentSuccess && (
            <SuccessPage
              banner={
                <Panel
                  title={successText}
                  workOrderReference={workOrderReference}
                  dateSelected={dateSelected}
                  slot={slot}
                  comments={comments}
                />
              }
              links={createWOLinks(workOrderReference, property)}
            />
          )}
        </>
      )}
    </>
  )
}

export default AppointmentView

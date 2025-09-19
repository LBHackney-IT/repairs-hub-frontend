import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
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
import { getWorkOrderDetails } from '@/root/src/utils/requests/workOrders'
import { APIResponseError } from '@/root/src/types/requests/types'
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

const AppointmentView = ({ workOrderReference, successText }) => {
  const [property, setProperty] = useState({})

  const [workOrder, setWorkOrder] = useState({})

  const [tenure, setTenure] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState({})
  const [availableAppointments, setAvailableAppointments] = useState([])
  const [comments, setComments] = useState('')
  const [dateSelected, setDateSelected] = useState('')
  const [slot, setSlot] = useState('')
  const [scheduleAppointmentSuccess, setScheduleAppointmentSuccess] =
    useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getAppointmentView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderResponse = await getWorkOrderDetails(workOrderReference)

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

      const tasksAndSors = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}/tasks`,
      })
      const propertyObject = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${workOrder.propertyReference}`,
      })
      const currentDate = beginningOfDay(new Date())
      const startOfCalendar = beginningOfWeek(currentDate)
      const endOfCalendar = daysAfter(startOfCalendar, 41)

      const availableAppointments = await frontEndApiRequest({
        method: 'get',
        path: '/api/appointments',
        params: {
          workOrderReference: workOrderReference,
          fromDate: toISODate(startOfCalendar),
          toDate: toISODate(endOfCalendar),
        },
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
      await frontEndApiRequest({
        method: 'post',
        path: `/api/appointments`,
        requestData: formData,
      }).then(() =>
        frontEndApiRequest({
          method: 'post',
          path: `/api/jobStatusUpdate`,
          requestData: commentsForJobStatus,
        })
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

AppointmentView.propTypes = {
  workOrderReference: PropTypes.string.isRequired,
  successText: PropTypes.string,
}

export default AppointmentView

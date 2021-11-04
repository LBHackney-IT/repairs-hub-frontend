import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { getAvailableAppointments } from '@/utils/frontEndApiClient/appointments'
import { beginningOfDay, beginningOfWeek, daysAfter } from '@/utils/time'
import BackButton from '../../Layout/BackButton'
import PropertyDetails from './PropertyDetails'
import WorkOrderTasks from './WorkOrderTasks'
import AppointmentCalendar from './AppointmentCalendar'
import ScheduleAppointmentSuccess from './ScheduleAppointmentSuccess'
import NoAvailableAppointments from './NoAvailableAppointments'
import { WorkOrder } from '@/models/workOrder'

const AppointmentView = ({ workOrderReference, successText }) => {
  const [property, setProperty] = useState({})
  const [workOrder, setWorkOrder] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [tasksAndSors, setTasksAndSors] = useState({})
  const [availableAppointments, setAvailableAppointments] = useState([])
  const [comments, setComments] = useState('')
  const [dateSelected, setDateSelected] = useState('')
  const [slot, setSlot] = useState('')
  const [scheduleAppointmentSuccess, setScheduleAppointmentSuccess] = useState(
    false
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const getAppointmentView = async (workOrderReference) => {
    setError(null)

    try {
      const workOrderData = await frontEndApiRequest({
        method: 'get',
        path: `/api/workOrders/${workOrderReference}`,
      })
      const workOrder = new WorkOrder(workOrderData)

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
      const endOfCalendar = daysAfter(startOfCalendar, 34)
      const availableAppointments = await getAvailableAppointments(
        workOrderReference,
        startOfCalendar,
        endOfCalendar
      )

      setWorkOrder(workOrder)
      setTasksAndSors(tasksAndSors)
      setProperty(propertyObject.property)
      setLocationAlerts(propertyObject.alerts.locationAlert)
      setPersonAlerts(propertyObject.alerts.personAlert)
      if (propertyObject.tenure) setTenure(propertyObject.tenure)
      setAvailableAppointments(availableAppointments)
    } catch (e) {
      setWorkOrder(null)
      setTasksAndSors(null)
      setProperty(null)
      setLocationAlerts(null)
      setPersonAlerts(null)
      setTenure(null)
      setAvailableAppointments(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
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
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
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
                  tenure={tenure}
                  subTypeDescription={property.hierarchyType.subTypeDescription}
                  locationAlerts={locationAlerts}
                  personAlerts={personAlerts}
                  canRaiseRepair={property.canRaiseRepair}
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
            <ScheduleAppointmentSuccess
              title={successText}
              property={property}
              workOrderReference={workOrderReference}
              dateSelected={dateSelected}
              slot={slot}
              comments={comments}
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

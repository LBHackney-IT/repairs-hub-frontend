import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { getRepair } from '../../../utils/frontend-api-client/repairs'
import { getProperty } from '../../../utils/frontend-api-client/properties'
import { getTasksAndSors } from '../../../utils/frontend-api-client/repairs/[id]/tasks'
import { getAvailableAppointments } from '../../../utils/frontend-api-client/appointments'
import { beginningOfDay, beginningOfWeek, daysAfter } from '../../../utils/time'
import BackButton from '../../Layout/BackButton/BackButton'
import PropertyDetails from './PropertyDetails'
import RepairTasks from './RepairTasks'
import AppointmentCalendar from './AppointmentCalendar'
import { postScheduleAppointment } from '../../../utils/frontend-api-client/appointments'
import ScheduleAppointmentSuccess from './ScheduleAppointmentSuccess'
import { postJobStatusUpdate } from '../../../utils/frontend-api-client/job-status-update'
import NoAvailableAppointments from './NoAvailableAppointments'

const AppointmentView = ({ workOrderReference }) => {
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
      const workOrder = await getRepair(workOrderReference)
      const tasksAndSors = await getTasksAndSors(workOrderReference)
      const propertyObject = await getProperty(workOrder.propertyReference)
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
    }

    setLoading(false)
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
      await postScheduleAppointment(formData).then(() =>
        postJobStatusUpdate(commentsForJobStatus)
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
                <RepairTasks tasks={tasksAndSors} />
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
}

export default AppointmentView

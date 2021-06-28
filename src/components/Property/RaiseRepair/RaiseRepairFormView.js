import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RaiseRepairForm from './RaiseRepairForm'
import SuccessPage from '../../SuccessPage/SuccessPage'
import Spinner from '../../Spinner/Spinner'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'
import { getProperty } from '../../../utils/frontend-api-client/properties'
import { getPriorities } from '../../../utils/frontend-api-client/schedule-of-rates/priorities'
import { getOrCreateSchedulerSessionId } from '../../../utils/frontend-api-client/users/schedulerSession'
import { postRepair } from '../../../utils/frontend-api-client/work-orders/schedule'
import { getTrades } from '../../../utils/frontend-api-client/schedule-of-rates/trades'
import { getCurrentUser } from '../../../utils/frontend-api-client/hub-user'
import { useRouter } from 'next/router'
import { priorityCodesRequiringAppointments } from '../../../utils/helpers/priorities'
import { STATUS_AUTHORISATION_PENDING_APPROVAL } from '../../../utils/status-codes'
import Meta from '../../Meta'

const RaiseRepairFormView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [locationAlerts, setLocationAlerts] = useState([])
  const [personAlerts, setPersonAlerts] = useState([])
  const [tenure, setTenure] = useState({})
  const [trades, setTrades] = useState([])
  const [priorities, setPriorities] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [formSuccess, setFormSuccess] = useState(false)
  const [
    authorisationPendingApproval,
    setAuthorisationPendingApproval,
  ] = useState(false)
  const [
    externallyManagedAppointment,
    setExternallyManagedAppointment,
  ] = useState(false)
  const [
    externalAppointmentManagementUrl,
    setExternalAppointmentManagementUrl,
  ] = useState()
  const [
    immediateOrEmergencyDloRepairText,
    setImmediateOrEmergencyDloRepairText,
  ] = useState(false)
  const [workOrderReference, setWorkOrderReference] = useState()
  const [currentUser, setCurrentUser] = useState()
  const router = useRouter()

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      const {
        id,
        statusCode,
        externallyManagedAppointment,
        externalAppointmentManagementUrl,
      } = await postRepair(formData)
      setWorkOrderReference(id)

      if (statusCode === STATUS_AUTHORISATION_PENDING_APPROVAL.code) {
        setAuthorisationPendingApproval(true)
      } else if (externallyManagedAppointment) {
        // Emergency and immediate DLO repairs are sent directly to the Planners
        // We display no link to open DRS
        if (
          !priorityCodesRequiringAppointments.includes(
            formData.priority.priorityCode
          )
        ) {
          setImmediateOrEmergencyDloRepairText(true)
        } else {
          const schedulerSessionId = await getOrCreateSchedulerSessionId()

          setExternallyManagedAppointment(true)
          setExternalAppointmentManagementUrl(
            `${externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`
          )
        }
      } else if (
        priorityCodesRequiringAppointments.includes(
          formData.priority.priorityCode
        )
      ) {
        router.push(`/work-orders/${id}/appointment/new`)
        return
      }

      setFormSuccess(true)
    } catch (e) {
      console.error(e)

      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  const getRaiseRepairFormView = async (propertyReference) => {
    setError(null)

    try {
      const data = await getProperty(propertyReference)
      const priorities = await getPriorities()
      const trades = await getTrades(propertyReference)
      const user = await getCurrentUser()

      setTenure(data.tenure)
      setProperty(data.property)
      setLocationAlerts(data.alerts.locationAlert)
      setPersonAlerts(data.alerts.personAlert)
      setPriorities(priorities)
      setTrades(trades)
      setContacts(data.contacts)
      setCurrentUser(user)
    } catch (e) {
      setProperty(null)
      setPriorities(null)
      setTrades(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getRaiseRepairFormView(propertyReference)
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Meta
            {...(property &&
              property.address && {
                title: `New repair at ${property.address.addressLine}`,
              })}
          />
          {formSuccess && workOrderReference && property && (
            <>
              <SuccessPage
                propertyReference={propertyReference}
                workOrderReference={workOrderReference}
                shortAddress={property.address.shortAddress}
                text={'Repair works order created'}
                showSearchLink={true}
                authorisationPendingApproval={authorisationPendingApproval}
                externalSchedulerLink={
                  externallyManagedAppointment &&
                  externalAppointmentManagementUrl
                }
                immediateOrEmergencyDloRepairText={
                  immediateOrEmergencyDloRepairText
                }
              />
            </>
          )}
          {!formSuccess &&
            property &&
            property.address &&
            property.hierarchyType &&
            property.canRaiseRepair &&
            locationAlerts &&
            personAlerts &&
            priorities &&
            trades && (
              <RaiseRepairForm
                propertyReference={propertyReference}
                address={property.address}
                hierarchyType={property.hierarchyType}
                canRaiseRepair={property.canRaiseRepair}
                tenure={tenure}
                locationAlerts={locationAlerts}
                personAlerts={personAlerts}
                priorities={priorities}
                trades={trades}
                contacts={contacts}
                onFormSubmit={onFormSubmit}
                raiseLimit={currentUser?.raiseLimit}
              />
            )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

RaiseRepairFormView.propTypes = {
  propertyReference: PropTypes.string.isRequired,
}

export default RaiseRepairFormView

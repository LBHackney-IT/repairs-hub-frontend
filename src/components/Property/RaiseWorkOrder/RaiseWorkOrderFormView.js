import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RaiseWorkOrderForm from './RaiseWorkOrderForm'
import SuccessPage from '../../SuccessPage'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { getOrCreateSchedulerSessionId } from '@/utils/frontEndApiClient/users/schedulerSession'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import {
  HIGH_PRIORITY_CODES,
  PRIORITY_CODES_REQUIRING_APPOINTMENTS,
} from '@/utils/helpers/priorities'
import { STATUS_AUTHORISATION_PENDING_APPROVAL } from '@/utils/statusCodes'
import Meta from '../../Meta'
import router from 'next/router'

const RaiseWorkOrderFormView = ({ propertyReference }) => {
  const [property, setProperty] = useState({})
  const [tenure, setTenure] = useState({})

  const [trades, setTrades] = useState([])
  const [tradeCode, setTradeCode] = useState('')

  const [contractors, setContractors] = useState([])
  const [contractorReference, setContractorReference] = useState('')

  const [budgetCodes, setBudgetCodes] = useState([])
  const [budgetCodeId, setBudgetCodeId] = useState('')

  const [sorCodeArrays, setSorCodeArrays] = useState([[]])
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

  const onFormSubmit = async (formData) => {
    setLoading(true)

    try {
      const {
        id,
        statusCode,
        externallyManagedAppointment,
        externalAppointmentManagementUrl,
      } = await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrders/schedule`,
        requestData: formData,
      })
      setWorkOrderReference(id)

      if (statusCode === STATUS_AUTHORISATION_PENDING_APPROVAL.code) {
        setAuthorisationPendingApproval(true)
      } else if (externallyManagedAppointment) {
        // Emergency and immediate DLO repairs are sent directly to the Planners
        // We display no link to open DRS
        if (HIGH_PRIORITY_CODES.includes(formData.priority.priorityCode)) {
          setImmediateOrEmergencyDloRepairText(true)
        } else {
          const schedulerSessionId = await getOrCreateSchedulerSessionId()

          setExternallyManagedAppointment(true)
          setExternalAppointmentManagementUrl(
            `${externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`
          )
        }
      } else if (
        PRIORITY_CODES_REQUIRING_APPOINTMENTS.includes(
          formData.priority.priorityCode
        )
      ) {
        router.push({
          pathname: `/work-orders/${id}/appointment/new`,
          query: { newOrder: true },
        })
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

  const getRaiseWorkOrderFormView = async (propertyReference) => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/properties/${propertyReference}`,
      })
      const priorities = await frontEndApiRequest({
        method: 'get',
        path: `/api/schedule-of-rates/priorities`,
      })
      const trades = await frontEndApiRequest({
        method: 'get',
        path: `/api/schedule-of-rates/trades?propRef=${propertyReference}`,
      })
      const user = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      setTenure(data.tenure)
      setProperty(data.property)
      setPriorities(priorities)
      setTrades(trades)
      setContacts(data.contactDetails)
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

    getRaiseWorkOrderFormView(propertyReference)
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
                text={'Repair work order created'}
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
            priorities &&
            trades && (
              <RaiseWorkOrderForm
                propertyReference={propertyReference}
                address={property.address}
                hierarchyType={property.hierarchyType}
                canRaiseRepair={property.canRaiseRepair}
                tenure={tenure}
                priorities={priorities}
                trades={trades}
                tradeCode={tradeCode}
                setTradeCode={setTradeCode}
                contractors={contractors}
                contractorReference={contractorReference}
                setContractorReference={setContractorReference}
                setContractors={setContractors}
                budgetCodeId={budgetCodeId}
                setBudgetCodeId={setBudgetCodeId}
                budgetCodes={budgetCodes}
                setBudgetCodes={setBudgetCodes}
                sorCodeArrays={sorCodeArrays}
                setSorCodeArrays={setSorCodeArrays}
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

RaiseWorkOrderFormView.propTypes = {
  propertyReference: PropTypes.string.isRequired,
}

export default RaiseWorkOrderFormView

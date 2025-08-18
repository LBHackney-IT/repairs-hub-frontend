import { useState, useEffect } from 'react'
import RepairsFinderForm from './RepairsFinderForm'
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
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'
import { Property, Tenure } from '@/root/src/models/propertyTenure'
import { isOutOfHoursGas } from './helpers'
import { Priority } from '@/root/src/models/priority'
import RaiseWorkOrderSuccessView from './RaiseWorkOrderSuccessView'
import { CurrentUser } from '@/root/src/types/variations/types'

interface Props {
  propertyReference: string
}

const RepairsFinderFormView = ({ propertyReference }: Props) => {
  const [property, setProperty] = useState<Property>()
  const [tenure, setTenure] = useState<Tenure>()

  const [priorities, setPriorities] = useState<Priority[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
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
  ] = useState<string>()

  const [
    immediateOrEmergencyRepairText,
    setImmediateOrEmergencyRepairText,
  ] = useState(false)
  const [workOrderReference, setWorkOrderReference] = useState()
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [immediateOrEmergencyDLO, setImmediateOrEmergencyDLO] = useState(false)

  const [contractorReference, setContractorReference] = useState<string>()
  const [tradeCode, setTradeCode] = useState<string>()

  const FORM_PAGE = 1
  const RAISE_SUCCESS_PAGE = 3
  const [currentPage, setCurrentPage] = useState(FORM_PAGE)

  const onFormSubmit = async (formData, parentWorkOrderId = null) => {
    setLoading(true)

    try {
      const params = {}

      if (parentWorkOrderId != null) {
        params['parentWorkOrderId'] = parentWorkOrderId
      }

      const {
        id,
        statusCode,
        externallyManagedAppointment,
        externalAppointmentManagementUrl,
      } = await frontEndApiRequest({
        method: 'post',
        path: `/api/workOrders/schedule`,
        requestData: formData,
        params,
      })
      setWorkOrderReference(id)

      if (statusCode === STATUS_AUTHORISATION_PENDING_APPROVAL.code) {
        setAuthorisationPendingApproval(true)
      } else if (externallyManagedAppointment) {
        // Emergency and immediate DLO repairs are sent directly to the Planners
        // We display no link to open DRS
        if (HIGH_PRIORITY_CODES.includes(formData.priority.priorityCode)) {
          setImmediateOrEmergencyRepairText(true)
          setImmediateOrEmergencyDLO(true)
        } else {
          const schedulerSessionId = await getOrCreateSchedulerSessionId()

          setExternallyManagedAppointment(true)
          setExternalAppointmentManagementUrl(
            `${externalAppointmentManagementUrl}&sessionId=${schedulerSessionId}`
          )
        }
      } else if (HIGH_PRIORITY_CODES.includes(formData.priority.priorityCode)) {
        setImmediateOrEmergencyRepairText(true)
      } else if (
        PRIORITY_CODES_REQUIRING_APPOINTMENTS.includes(
          formData.priority.priorityCode
        ) &&
        !isOutOfHoursGas(contractorReference, tradeCode)
      ) {
        router.push({
          pathname: `/work-orders/${id}/appointment/new`,
          query: { newOrder: true },
        })
        return
      }

      setCurrentPage(RAISE_SUCCESS_PAGE)
    } catch (e) {
      console.error(e)

      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const getRaiseWorkOrderFormView = async (propertyReference) => {
    setError(null)

    try {
      const [propertyResponse, priorities, user] = await Promise.all([
        frontEndApiRequest({
          method: 'get',
          path: `/api/properties/${propertyReference}`,
        }),
        frontEndApiRequest({
          method: 'get',
          path: `/api/schedule-of-rates/priorities`,
        }),
        frontEndApiRequest({
          method: 'get',
          path: '/api/hub-user',
        }),
      ])

      setTenure(propertyResponse.tenure)
      setProperty(propertyResponse.property)
      setPriorities(priorities)
      setCurrentUser(user)
    } catch (e) {
      setProperty(null)
      setPriorities(null)
      console.error('An error has occurred:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getRaiseWorkOrderFormView(propertyReference)
  }, [])

  const showSuccessPage =
    currentPage === RAISE_SUCCESS_PAGE && workOrderReference && property

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <Meta
        {...(property &&
          property.address && {
            title: `New repair at ${property.address.addressLine}`,
          })}
      />

      {showSuccessPage && (
        <RaiseWorkOrderSuccessView
          workOrderReference={workOrderReference}
          authorisationPendingApproval={authorisationPendingApproval}
          immediateOrEmergencyRepairText={immediateOrEmergencyRepairText}
          immediateOrEmergencyDLO={immediateOrEmergencyDLO}
          externallyManagedAppointment={externallyManagedAppointment}
          property={property}
          externalAppointmentManagementUrl={externalAppointmentManagementUrl}
          currentUser={currentUser}
        />
      )}

      {currentPage === FORM_PAGE &&
        property !== null &&
        property?.canRaiseRepair &&
        priorities !== null && (
          <RepairsFinderForm
            propertyReference={propertyReference}
            address={property?.address}
            hierarchyType={property?.hierarchyType}
            canRaiseRepair={property?.canRaiseRepair}
            tenure={tenure}
            priorities={priorities}
            onFormSubmit={onFormSubmit}
            raiseLimit={currentUser?.raiseLimit}
            setContractorReference={setContractorReference}
            setTradeCode={setTradeCode}
          />
        )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default RepairsFinderFormView

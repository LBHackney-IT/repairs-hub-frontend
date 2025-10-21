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

interface ScheduleRepairResponse {
  id: string
  statusCode: number
  statusCodeDescription: string
  externallyManagedAppointment: boolean
  externalAppointmentManagementUrl: string
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
  const [workOrderReference, setWorkOrderReference] = useState<string>()
  const [currentUser, setCurrentUser] = useState<CurrentUser>()
  const [
    immediateOrEmergencyDLO,
    setImmediateOrEmergencyDLO,
  ] = useState<boolean>(false)

  const [contractorReference, setContractorReference] = useState<string>()
  const [tradeCode, setTradeCode] = useState<string>()

  const FORM_PAGE = 1
  const RAISE_SUCCESS_PAGE = 3
  const [currentPage, setCurrentPage] = useState(FORM_PAGE)

  const onFormSubmit = async (formData) => {
    setLoading(true)

    const scheduleResponse = await scheduleRepair(formData)

    if (scheduleResponse == null) {
      // an error occured
      return
    }

    await updateStateForSuccessPage(formData, scheduleResponse)
    setCurrentPage(RAISE_SUCCESS_PAGE)

    setLoading(false)
  }

  const scheduleRepair = async (formData) => {
    try {
      const scheduleResponse: ScheduleRepairResponse = await frontEndApiRequest(
        {
          method: 'post',
          path: `/api/workOrders/schedule`,
          requestData: formData,
          params: {},
        }
      )

      setWorkOrderReference(scheduleResponse.id)

      return scheduleResponse
    } catch (e) {
      console.error(e)

      setError(formatRequestErrorMessage(e))
      return null
    }
  }

  const updateStateForSuccessPage = async (
    formData: any,
    scheduleResponse: ScheduleRepairResponse
  ) => {
    const { statusCode, id } = scheduleResponse

    if (statusCode === STATUS_AUTHORISATION_PENDING_APPROVAL.code) {
      setAuthorisationPendingApproval(true)
      return
    }

    if (externallyManagedAppointment) {
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
      return
    }

    if (HIGH_PRIORITY_CODES.includes(formData.priority.priorityCode)) {
      setImmediateOrEmergencyRepairText(true)
      setCurrentPage(RAISE_SUCCESS_PAGE)
      return
    }

    if (
      PRIORITY_CODES_REQUIRING_APPOINTMENTS.includes(
        formData.priority.priorityCode
      ) &&
      !isOutOfHoursGas(contractorReference, tradeCode)
    ) {
      router.push({
        pathname: `/work-orders/${id}/appointment/new`,
        query: { newOrder: true },
      })
    }
  }

  const getRaiseWorkOrderFormView = async (propertyReference: string) => {
    setError(null)
    setLoading(true)

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

      {currentPage === FORM_PAGE && (
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

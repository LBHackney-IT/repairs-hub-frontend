import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RaiseWorkOrderForm from './RaiseWorkOrderForm'
import SuccessPage from '@/components/SuccessPage'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { getOrCreateSchedulerSessionId } from '@/utils/frontEndApiClient/users/schedulerSession'
import {
  createSorExistenceValidator,
  frontEndApiRequest,
} from '@/utils/frontEndApiClient/requests'
import {
  HIGH_PRIORITY_CODES,
  PRIORITY_CODES_REQUIRING_APPOINTMENTS,
} from '@/utils/helpers/priorities'
import { STATUS_AUTHORISATION_PENDING_APPROVAL } from '@/utils/statusCodes'
import Meta from '../../Meta'
import router from 'next/router'
import { createWOLinks, LinksWithDRSBooking } from '@/utils/successPageLinks'
import Panel from '@/components/Template/Panel'
import AddMultipleSORs from './AddMultipleSORs'

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

  const [formState, setFormState] = useState({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
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
    immediateOrEmergencyRepairText,
    setImmediateOrEmergencyRepairText,
  ] = useState(false)

  const [announcementMessage, setAnnouncementMessage] = useState('')

  const [workOrderReference, setWorkOrderReference] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [immediateOrEmergencyDLO, setImmediateOrEmergencyDLO] = useState(false)

  const FORM_PAGE = 1
  const ADDING_MULTIPLE_SOR_PAGE = 2
  const RAISE_SUCCESS_PAGE = 3
  const [currentPage, setCurrentPage] = useState(FORM_PAGE)
  const [isPriorityEnabled, setIsPriorityEnabled] = useState(false)
  const [isIncrementalSearchEnabled, setIsIncrementalSearchEnabled] = useState(
    false
  )

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
          setImmediateOrEmergencyRepairText(true)
          setImmediateOrEmergencyDLO(true)
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

      setCurrentPage(RAISE_SUCCESS_PAGE)
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

  const warningTextToShow = () => {
    if (immediateOrEmergencyRepairText) {
      if (immediateOrEmergencyDLO) {
        return 'Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked.'
      } else
        return 'Emergency and immediate repairs must be booked immediately. Please call the external contractor.'
    } else if (authorisationPendingApproval) {
      return 'Please request authorisation from a manager.'
    } else {
      return ''
    }
  }

  useEffect(() => {
    setLoading(true)

    getRaiseWorkOrderFormView(propertyReference)
  }, [])

  const setSorCodesFromBatchUpload = (sorCodes) => {
    setSorCodeArrays(() => {
      return [
        ...sorCodeArrays.filter(
          (sca, index) => formState?.rateScheduleItems[index]?.code !== ''
        ),
        ...sorCodes.map((c) => [c]),
      ]
    })

    setFormState((formState) => {
      return {
        ...formState,
        rateScheduleItems: [
          ...formState?.rateScheduleItems.filter((rsi) => rsi.code !== ''),
          ...sorCodes.map((code) => ({
            code: `${code.code} - ${code.shortDescription}`,
            cost: code.cost.toString(),
            description: code.shortDescription,
          })),
        ],
      }
    })
  }

  const renderAnnouncement = () => {
    return (
      announcementMessage && (
        <section className="lbh-page-announcement">
          <div className="lbh-page-announcement__content">
            <strong className="govuk-!-font-size-24">
              {announcementMessage}
            </strong>
          </div>
        </section>
      )
    )
  }

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

          {currentPage === RAISE_SUCCESS_PAGE &&
            workOrderReference &&
            property && (
              <>
                <SuccessPage
                  banner={
                    <Panel
                      title="Work order created"
                      authorisationText={
                        authorisationPendingApproval &&
                        'but requires authorisation'
                      }
                      workOrderReference={workOrderReference}
                    />
                  }
                  warningText={warningTextToShow()}
                  links={
                    externallyManagedAppointment
                      ? LinksWithDRSBooking(
                          workOrderReference,
                          property,
                          externalAppointmentManagementUrl,
                          currentUser.name
                        )
                      : createWOLinks(workOrderReference, property)
                  }
                />
              </>
            )}

          {renderAnnouncement()}

          {currentPage === FORM_PAGE &&
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
                setPageToMultipleSORs={(formState) => {
                  setAnnouncementMessage('')
                  setFormState(formState)
                  setCurrentPage(ADDING_MULTIPLE_SOR_PAGE)
                }}
                formState={formState}
                isPriorityEnabled={isPriorityEnabled}
                isIncrementalSearchEnabled={isIncrementalSearchEnabled}
                setIsIncrementalSearchEnabled={setIsIncrementalSearchEnabled}
              />
            )}

          {currentPage === ADDING_MULTIPLE_SOR_PAGE && (
            <AddMultipleSORs
              currentSorCodes={formState?.rateScheduleItems.map(
                (rsi) => rsi.code.split(' - ')[0]
              )}
              setPageBackToFormView={() => setCurrentPage(FORM_PAGE)}
              sorExistenceValidationCallback={createSorExistenceValidator(
                tradeCode,
                propertyReference,
                contractorReference,
                true
              )}
              setSorCodesFromBatchUpload={setSorCodesFromBatchUpload}
              setAnnouncementMessage={setAnnouncementMessage}
              setIsPriorityEnabled={setIsPriorityEnabled}
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

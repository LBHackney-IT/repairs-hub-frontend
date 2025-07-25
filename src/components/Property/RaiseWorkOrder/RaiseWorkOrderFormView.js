import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import RaiseWorkOrderForm from './RaiseWorkOrderForm'
import SuccessPage from '@/components/SuccessPage'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { getOrCreateSchedulerSessionId } from '@/utils/frontEndApiClient/users/schedulerSession'
import {
  frontEndApiRequest,
  createSorExistenceValidator,
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
import { formatRequestErrorMessage } from '@/root/src/utils/errorHandling/formatErrorMessage'

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
  const [workOrderReference, setWorkOrderReference] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [immediateOrEmergencyDLO, setImmediateOrEmergencyDLO] = useState(false)

  const [announcementMessage, setAnnouncementMessage] = useState('')

  const FORM_PAGE = 1
  const ADDING_MULTIPLE_SOR_PAGE = 2
  const RAISE_SUCCESS_PAGE = 3
  const [currentPage, setCurrentPage] = useState(FORM_PAGE)
  const [isPriorityEnabled, setIsPriorityEnabled] = useState(false)
  const [isIncrementalSearchEnabled, setIsIncrementalSearchEnabled] = useState(
    false
  )

  const isOutOfHoursGas = (contractorReference, tradeCode) => {
    const gasBreakdownContractorReference = 'H04'
    const oohTradeCode = 'OO'

    if (contractorReference != gasBreakdownContractorReference) return false // contractor must be "H04"
    return tradeCode == oohTradeCode
  }

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
      const [propertyResponse, priorities, trades, user] = await Promise.all([
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
          path: `/api/schedule-of-rates/trades?propRef=${propertyReference}`,
        }),
        frontEndApiRequest({
          method: 'get',
          path: '/api/hub-user',
        }),
      ])

      setTenure(propertyResponse.tenure)
      setProperty(propertyResponse.property)
      setPriorities(priorities)
      setTrades(trades)
      setCurrentUser(user)
    } catch (e) {
      setProperty(null)
      setPriorities(null)
      setTrades(null)
      console.error('An error has occurred:', e.response)
      setError(formatRequestErrorMessage(e))
    }

    setLoading(false)
  }

  const warningTextToShow = () => {
    if (immediateOrEmergencyRepairText) {
      if (immediateOrEmergencyDLO) {
        return 'Emergency and immediate DLO repairs are sent directly to the planners. An appointment does not need to be booked'
      } else
        return 'Emergency and immediate repairs must be booked immediately. Please call the external contractor'
    } else if (authorisationPendingApproval) {
      return 'Please request authorisation from a manager'
    } else {
      return ''
    }
  }

  useEffect(() => {
    setLoading(true)

    getRaiseWorkOrderFormView(propertyReference)
  }, [])

  const setSorCodesFromBatchUpload = (sorCodes) => {
    if (isIncrementalSearchEnabled) {
      const sorCodesInIncremental = [
        ...sorCodeArrays.filter(
          (sca, index) => formState?.rateScheduleItems[index]?.code !== ''
        ),
        ...sorCodes.map((c) => [c]),
      ]

      setSorCodeArrays(() => sorCodesInIncremental)
    } else {
      const sorCodesInNonIncremental = [
        ...sorCodeArrays,
        ...sorCodes.map(() => sorCodeArrays),
      ].filter((e) => e.length != 0)

      setSorCodeArrays(() => sorCodesInNonIncremental)
    }

    setFormState((formState) => {
      return {
        ...formState,
        rateScheduleItems: [
          ...formState?.rateScheduleItems.filter((rsi) => rsi.code !== ''),
          ...sorCodes.map((code) => ({
            code: `${code.code} - ${
              code.shortDescription
            } - £${code.cost.toString()}`,
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

  const getCurrentSORCodes = () => {
    if (formState != null && formState.rateScheduleItems == null) {
      formState.rateScheduleItems = []
    }

    return [
      ...formState?.rateScheduleItems.map((rsi) => rsi.code.split(' - ')[0]),
    ]
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
              currentSorCodes={getCurrentSORCodes()}
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

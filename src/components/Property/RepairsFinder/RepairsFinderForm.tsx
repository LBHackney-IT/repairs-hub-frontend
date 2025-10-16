import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import PropertyFlags from '../PropertyFlags'
import BackButton from '../../Layout/BackButton'
import { PrimarySubmitButton, TextInput } from '../../Form'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { buildScheduleWorkOrderFormData } from '@/utils/hact/workOrderSchedule/raiseWorkOrderForm'
import { IMMEDIATE_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { daysInHours } from '@/utils/time'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { getAlerts } from '@/root/src/utils/requests/property'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import RaiseWorkOrderFollowOn from '../RaiseWorkOrder/RaiseWorkOrderFollowOn/RaiseWorkOrderFollowOn'
import UserContext from '../../UserContext'
import { canAssignFollowOnRelationship } from '@/root/src/utils/userPermissions'
import {
  Address,
  HierarchyType,
  Tenure,
} from '@/root/src/models/propertyTenure'
import { Priority } from '@/root/src/models/priority'
import { getPriorityObjectByCode } from './helpers'
import RepairsFinderInput from './RepairsFinderInput'
import { CautionaryAlert } from '@/root/src/models/cautionaryAlerts'
import Alerts from '../Alerts'

interface Props {
  propertyReference: string
  address: Address
  hierarchyType: HierarchyType
  canRaiseRepair: boolean
  tenure: Tenure
  priorities: Priority[]
  onFormSubmit: (...args: any[]) => void
  raiseLimit: string | null
  setContractorReference: (reference: string) => void
  setTradeCode: (tradeCode: string) => void
}

const RepairsFinderForm = (props: Props) => {
  const {
    propertyReference,
    address,
    hierarchyType,
    canRaiseRepair,
    tenure,
    priorities,
    onFormSubmit,
    raiseLimit,
    setContractorReference,
    setTradeCode,
  } = props

  const { register, handleSubmit, errors, watch, setValue } = useForm()

  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState(false)
  const [legalDisrepairError, setLegalDisRepairError] = useState<string>()

  const [totalCost, setTotalCost] = useState<number>()
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState()
  const overSpendLimit = totalCost > parseInt(raiseLimit)

  const [alerts, setAlerts] = useState<CautionaryAlert[]>([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [alertsError, setAlertsError] = useState<string | null>()
  const [isExpanded, setIsExpanded] = useState(false)

  const onSubmit = async (formData) => {
    const priority = getPriorityObjectByCode(formData.priorityCode, priorities)

    const scheduleWorkOrderFormData = buildScheduleWorkOrderFormData({
      ...formData,
      propertyReference,
      shortAddress: address.shortAddress,
      postalCode: address.postalCode,
      priorityDescription: priority.description,
      daysToComplete: priority.daysToComplete,
      hoursToComplete:
        // Hours can't be derived for immediates as they have 0 days for completion
        priority.priorityCode === IMMEDIATE_PRIORITY_CODE
          ? 2
          : daysInHours(priority.daysToComplete),
    })

    // follow-on parent
    const parentWorkOrderId =
      formData?.isFollowOn === 'true' && formData?.parentWorkOrder
        ? formData.parentWorkOrder
        : null

    onFormSubmit(scheduleWorkOrderFormData, parentWorkOrderId)
  }

  const getPropertyInfoOnLegalDisrepair = (propertyReference) => {
    frontEndApiRequest({
      method: 'get',
      path: `/api/properties/legalDisrepair/${propertyReference}`,
    })
      .then((isInLegalDisrepair) =>
        setIsInLegalDisrepair(isInLegalDisrepair.propertyIsInLegalDisrepair)
      )
      .catch((error) => {
        console.error('Error loading legal disrepair status:', error.response)
        setLegalDisRepairError(
          `Error loading legal disrepair status: ${error.response?.status} with message: ${error.response?.data?.message}`
        )
      })
      .finally(() => setLoading(false))
  }

  const fetchAlerts = async () => {
    setAlertsLoading(true)
    const alertsResponse = await getAlerts(propertyReference)

    if (!alertsResponse.success) {
      setAlertsError(alertsResponse.error.message)
      setAlertsLoading(false)
      return
    }

    setAlerts(alertsResponse.response.alerts)
    setAlertsLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    getPropertyInfoOnLegalDisrepair(propertyReference)
    fetchAlerts()
  }, [])

  return (
    <>
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l lbh-caption">New repair</span>
          <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
            {hierarchyType?.subTypeDescription}: {address?.addressLine}
          </h1>

          {loading && <Spinner />}

          {isInLegalDisrepair && !loading && (
            <WarningInfoBox
              header="This property is currently under legal disrepair"
              text="Before raising a work order you must call the Legal Disrepair Team"
            />
          )}

          {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}

          <div className="lbh-body-s">
            {alertsLoading && <Spinner resource="alerts" />}
            {alerts?.length > 0 && (
              <ul
                className="lbh-list hackney-property-alerts"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginBottom: '1em',
                  maxWidth: isExpanded ? '' : '30em',
                }}
              >
                <Alerts
                  alerts={alerts}
                  setIsExpanded={setIsExpanded}
                  isExpanded={isExpanded}
                />
              </ul>
            )}

            {alertsError && <ErrorMessage label={alertsError} />}

            <PropertyFlags canRaiseRepair={canRaiseRepair} tenure={tenure} />
          </div>
          <h2 className="lbh-heading-h2 govuk-!-margin-top-6">
            Work order task details
          </h2>
          <form
            role="form"
            id="repair-request-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {canAssignFollowOnRelationship(user) && (
              <RaiseWorkOrderFollowOn
                register={register}
                errors={errors}
                propertyReference={propertyReference}
                watch={watch}
              />
            )}

            <RepairsFinderInput
              propertyReference={propertyReference}
              register={register}
              setTotalCost={setTotalCost}
              setContractorReference={setContractorReference}
              setTradeCode={setTradeCode}
              priorities={priorities}
            />

            <Contacts tenureId={tenure?.id} />

            <h2 className=" lbh-heading-h2">
              Contact details for repair
              <span className="govuk-caption-m">
                Who should we contact for this repair?
              </span>
            </h2>

            <TextInput
              name="callerName"
              label="Caller name"
              required={true}
              register={register({
                required: 'Please add caller name',
                maxLength: {
                  value: 50,
                  message:
                    'You have exceeded the maximum amount of 50 characters',
                },
              })}
              error={errors && errors.callerName}
            />

            <TextInput
              name="contactNumber"
              label="Telephone number"
              required={true}
              register={register({
                required: 'Please add telephone number',
                validate: (value) => {
                  if (isNaN(value)) {
                    return 'Telephone number should be a number and with no empty spaces'
                  }
                },
                maxLength: {
                  value: 11,
                  message:
                    'Please enter a valid UK telephone number (11 digits)',
                },
              })}
              error={errors && errors.contactNumber}
            />

            {overSpendLimit && (
              <WarningText
                name="over-spend-limit"
                text="The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation"
              />
            )}

            <PrimarySubmitButton
              id="submit-work-order-create"
              label="Create work order"
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default RepairsFinderForm

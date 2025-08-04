import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import PropertyFlags from '../PropertyFlags'
import BackButton from '../../Layout/BackButton'
import {
  PrimarySubmitButton,
  CharacterCountLimitedTextArea,
  TextInput,
} from '../../Form'
import TradeContractorRateScheduleItemView from '../RaiseWorkOrder/TradeContractorRateScheduleItemView'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { buildScheduleWorkOrderFormData } from '@/utils/hact/workOrderSchedule/raiseWorkOrderForm'
import { IMMEDIATE_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { daysInHours } from '@/utils/time'
import SelectPriority from '../RaiseWorkOrder/SelectPriority'
import { PRIORITY_CODES_WITHOUT_DRS } from '@/utils/helpers/priorities'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import RaiseWorkOrderFollowOn from '../RaiseWorkOrder/RaiseWorkOrderFollowOn/RaiseWorkOrderFollowOn'
import UserContext from '../../UserContext'
import { canAssignFollowOnRelationship } from '@/root/src/utils/userPermissions'
import { Address, HierarchyType } from '@/root/src/models/property'
import { Tenure } from '@/root/src/models/tenure'
import { Priority } from '@/root/src/models/priority'
import {
  getPriorityObjectByCode,
  getPriorityObjectByDescription,
} from './helpers'
import RepairsFinderInput from './RepairsFinderInput'

const { NEXT_PUBLIC_RELATED_WORKORDRES_TAB_ENABLED } = process.env

interface Props {
  propertyReference: string
  address: Address
  hierarchyType: HierarchyType
  canRaiseRepair: boolean
  tenure: Tenure
  trades: object[]
  contractors: object[]
  setContractors: (...args: any[]) => void
  budgetCodes: object[]
  setBudgetCodes: (...args: any[]) => void
  sorCodeArrays: object[]
  setSorCodeArrays: (...args: any[]) => void
  priorities: Priority[]
  onFormSubmit: (...args: any[]) => void
  tradeCode: string
  setTradeCode: (...args: any[]) => void
  contractorReference: string
  setContractorReference: (...args: any[]) => void
  budgetCodeId: string | number
  setBudgetCodeId: (...args: any[]) => void
  setPageToMultipleSORs: (...args: any[]) => void
  raiseLimit: string | null
  formState: any

  isPriorityEnabled: boolean
  isIncrementalSearchEnabled: boolean
  setIsIncrementalSearchEnabled: (...args: any[]) => void
}

const RaiseWorkOrderForm = (props: Props) => {
  const {
    propertyReference,
    address,
    hierarchyType,
    canRaiseRepair,
    tenure,
    priorities,
    trades,
    tradeCode,
    setTradeCode,
    contractors,
    contractorReference,
    setContractorReference,
    setContractors,
    budgetCodeId,
    setBudgetCodeId,
    budgetCodes,
    setBudgetCodes,
    sorCodeArrays,
    setSorCodeArrays,
    onFormSubmit,
    raiseLimit,
    setPageToMultipleSORs,
    formState,
    isPriorityEnabled,
    isIncrementalSearchEnabled,
    setIsIncrementalSearchEnabled,
  } = props

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: { ...formState },
  })

  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState(false)
  const [legalDisrepairError, setLegalDisRepairError] = useState<string>()
  const [priorityCode, setPriorityCode] = useState<number>()

  const [totalCost, setTotalCost] = useState('')
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState()
  const overSpendLimit = totalCost > raiseLimit

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

  const onPrioritySelect = (code) => {
    setPriorityCode(code)
  }

  const filterPriorities = (filterText) => {
    // setPriorities was never passed in, this code should be redundent
    // setPriorities(
    //   priorities.filter(function (pri) {
    //     return pri.description.includes(filterText)
    //   })
    // )
  }

  const updatePriority = (
    description,
    code,
    rateScheduleItemsLength,
    existingHigherPriorityCode
  ) => {
    if (existingHigherPriorityCode) {
      description = getPriorityObjectByCode(
        existingHigherPriorityCode,
        priorities
      )?.description
    }

    if (getPriorityObjectByDescription(description, priorities)) {
      // Update priority when SOR code has priority attached if:
      // Priority description is blank, or there's only one sor code entry, or
      // when removing an SOR there's an existing entry with higher priority, or
      // the selected priority code is less than existing priority codes
      // (Higher priority as code gets lower)
      if (
        !priorityCode ||
        rateScheduleItemsLength <= 1 ||
        existingHigherPriorityCode ||
        code < priorityCode
      ) {
        if (errors?.priorityCode) {
          delete errors.priorityCode
        }

        setPriorityCode(
          getPriorityObjectByDescription(description, priorities)?.priorityCode
        )

        setValue(
          'priorityCode',
          getPriorityObjectByDescription(description, priorities)?.priorityCode
        )
      }
    } else {
      console.error(
        `Priority: "${description}" is not included in the available priorities list`
      )
    }
  }

  useEffect(() => {
    setLoading(true)

    getPropertyInfoOnLegalDisrepair(propertyReference)
    isPriorityEnabled &&
      (document.getElementById('priorityCode').disabled = false)
  }, [])

  return (
    <>
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l lbh-caption">New repair</span>
          <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
            {hierarchyType.subTypeDescription}: {address.addressLine}
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
            <PropertyFlags
              canRaiseRepair={canRaiseRepair}
              tenure={tenure}
              propertyReference={propertyReference}
            />
          </div>
          <h2 className="lbh-heading-h2 govuk-!-margin-top-6">
            Work order task details
          </h2>
          <form
            role="form"
            id="repair-request-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            {canAssignFollowOnRelationship(user) &&
              NEXT_PUBLIC_RELATED_WORKORDRES_TAB_ENABLED === 'true' && (
                <RaiseWorkOrderFollowOn
                  register={register}
                  errors={errors}
                  propertyReference={propertyReference}
                  watch={watch}
                />
              )}

            <RepairsFinderInput
              register={register}
              formState={formState}
              propertyReference={propertyReference}
            />

            <CharacterCountLimitedTextArea
              name="descriptionOfWork"
              label="Repair description"
              required={true}
              maxLength={230}
              requiredText="Please enter a repair description"
              register={register}
              error={errors && errors.descriptionOfWork}
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

export default RaiseWorkOrderForm

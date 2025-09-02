import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react'
import { useForm } from 'react-hook-form'
import PropertyFlags from '../PropertyFlags'
import BackButton from '../../Layout/BackButton'
import {
  PrimarySubmitButton,
  CharacterCountLimitedTextArea,
  TextInput,
} from '../../Form'
import TradeContractorRateScheduleItemView from './TradeContractorRateScheduleItemView'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import WarningInfoBox from '../../Template/WarningInfoBox'
import { buildScheduleWorkOrderFormData } from '@/utils/hact/workOrderSchedule/raiseWorkOrderForm'
import { IMMEDIATE_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { daysInHours } from '@/utils/time'
import SelectPriority from './SelectPriority'
import { PRIORITY_CODES_WITHOUT_DRS } from '@/utils/helpers/priorities'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/Errors/ErrorMessage'
import RaiseWorkOrderFollowOn from './RaiseWorkOrderFollowOn/RaiseWorkOrderFollowOn'
import UserContext from '../../UserContext'
import { canAssignFollowOnRelationship } from '@/root/src/utils/userPermissions'
import Link from 'next/link'
import { useFeatureToggles } from '@/root/src/utils/frontEndApiClient/hooks/useFeatureToggles'
import { Priority } from '@/root/src/models/priority'
import { BudgetCode } from '@/root/src/models/budgetCode'
import Contractor from '@/root/src/models/contractor'
import { Trades } from '@/root/src/utils/requests/trades'
import {
  Address,
  HierarchyType,
  Tenure,
} from '@/root/src/models/propertyTenure'
import SorCode from '@/root/src/models/sorCode'

interface Props {
  propertyReference: string
  address: Address
  hierarchyType: HierarchyType
  canRaiseRepair: boolean
  tenure: Tenure
  trades: Trades[]
  contractors: Contractor[]
  setContractors: Dispatch<SetStateAction<Contractor[]>>
  budgetCodes: BudgetCode[]
  setBudgetCodes: Dispatch<SetStateAction<BudgetCode[]>>
  sorCodeArrays: SorCode[][]
  setSorCodeArrays: Dispatch<SetStateAction<SorCode[][]>>
  priorities: Priority[]
  onFormSubmit: (formData: any, parentWorkOrderId?: string) => void
  tradeCode: string
  setTradeCode: Dispatch<SetStateAction<string>>
  contractorReference: string
  setContractorReference: Dispatch<SetStateAction<string>>
  budgetCodeId: string | number
  setBudgetCodeId: Dispatch<SetStateAction<string>>
  setPageToMultipleSORs: Dispatch<SetStateAction<string>>
  raiseLimit: string

  formState: any
  isPriorityEnabled: boolean
  isIncrementalSearchEnabled: boolean
  setIsIncrementalSearchEnabled: Dispatch<SetStateAction<boolean>>
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
  const { simpleFeatureToggles } = useFeatureToggles()

  const [loading, setLoading] = useState<boolean>(false)
  const [legalDisrepairError, setLegalDisRepairError] = useState<
    string | null
  >()
  const [priorityCode, setPriorityCode] = useState<number>()

  const [totalCost, setTotalCost] = useState('')
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState<boolean>()
  const overSpendLimit = totalCost > raiseLimit

  const onSubmit = async (formData) => {
    const priority = getPriorityObjectByCode(formData.priorityCode)

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

  const getPriorityObjectByDescription = (description: string) => {
    return priorities.find((priority) => priority.description === description)
  }

  const getPriorityObjectByCode = (code) => {
    return priorities.find((priority) => priority.priorityCode == code)
  }

  const onPrioritySelect = (code) => {
    setPriorityCode(code)
  }

  const updatePriority = (
    description,
    code,
    rateScheduleItemsLength,
    existingHigherPriorityCode
  ) => {
    if (existingHigherPriorityCode) {
      description = getPriorityObjectByCode(existingHigherPriorityCode)
        ?.description
    }

    if (getPriorityObjectByDescription(description)) {
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

        const priortyObject = getPriorityObjectByDescription(description)

        setPriorityCode(priortyObject.priorityCode)

        setValue('priorityCode', priortyObject?.priorityCode)
      }
    } else {
      console.error(
        `Priority: "${description}" is not included in the available priorities list`
      )
    }
  }

  const renderLegalDisrepair = (isInLegalDisrepair) => {
    return (
      isInLegalDisrepair && (
        <WarningInfoBox
          header="This property is currently under legal disrepair"
          text="Before raising a work order you must call the Legal Disrepair Team"
        />
      )
    )
  }

  useEffect(() => {
    setLoading(true)

    getPropertyInfoOnLegalDisrepair(propertyReference)

    if (isPriorityEnabled) {
      ;(document.getElementById(
        'priorityCode'
      ) as HTMLInputElement).disabled = false
    }
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

          {simpleFeatureToggles?.enableRepairsFinderIntegration && (
            <WarningInfoBox
              className="variant-warning govuk-!-margin-bottom-4"
              header="Looking to use Repairs Finder?"
              name="despatched-warning"
              text={
                <>
                  <Link href="/properties/00023400/raise-repair/repairs-finder">
                    Use our new form
                  </Link>{' '}
                  that works with Repairs Finder.
                </>
              }
            />
          )}

          {loading ? <Spinner /> : renderLegalDisrepair(isInLegalDisrepair)}

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
            {canAssignFollowOnRelationship(user) && (
              <RaiseWorkOrderFollowOn
                register={register}
                errors={errors}
                propertyReference={propertyReference}
                watch={watch}
              />
            )}

            <TradeContractorRateScheduleItemView
              register={register}
              errors={errors}
              trades={trades}
              tradeCode={tradeCode}
              setTradeCode={setTradeCode}
              contractors={contractors}
              setContractors={setContractors}
              contractorReference={contractorReference}
              setContractorReference={setContractorReference}
              budgetCodes={budgetCodes}
              setBudgetCodes={setBudgetCodes}
              budgetCodeId={budgetCodeId}
              setBudgetCodeId={setBudgetCodeId}
              sorCodeArrays={sorCodeArrays}
              setSorCodeArrays={setSorCodeArrays}
              propertyReference={propertyReference}
              updatePriority={updatePriority}
              getPriorityObjectByCode={getPriorityObjectByCode}
              setTotalCost={setTotalCost}
              setValue={setValue}
              setPageToMultipleSORs={() => setPageToMultipleSORs(getValues())}
              filterPriorities={() => {}}
              formState={formState}
            />

            <SelectPriority
              priorities={priorities}
              onPrioritySelect={onPrioritySelect}
              register={register}
              errors={errors}
              priorityCode={priorityCode}
              priorityCodesWithoutDrs={PRIORITY_CODES_WITHOUT_DRS}
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

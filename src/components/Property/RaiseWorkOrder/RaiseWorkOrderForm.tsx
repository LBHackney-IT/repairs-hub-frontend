import { useState, useContext, Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import BackButton from '../../Layout/BackButton'
import {
  PrimarySubmitButton,
  CharacterCountLimitedTextArea,
  TextInput,
} from '../../Form'
import TradeContractorRateScheduleItemView from './TradeContractorRateScheduleItemView'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import { buildScheduleWorkOrderFormData } from '@/utils/hact/workOrderSchedule/raiseWorkOrderForm'
import { IMMEDIATE_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { daysInHours } from '@/utils/time'
import SelectPriority from './SelectPriority'
import RaiseWorkOrderFollowOn from './RaiseWorkOrderFollowOn/RaiseWorkOrderFollowOn'
import UserContext from '@/components/UserContext'
import { canAssignFollowOnRelationship } from '@/root/src/utils/userPermissions'
import { Priority } from '@/root/src/models/priority'
import { BudgetCode } from '@/root/src/models/budgetCode'
import Contractor from '@/root/src/models/contractor'
import { Property, Tenure } from '@/root/src/models/propertyTenure'
import SorCode from '@/root/src/models/sorCode'
import { Trade } from '@/root/src/models/trade'
import PropertyFlagsWrapper from '../../PropertyFlagsWrapper/PropertyFlagsWrapper'

interface Props {
  propertyReference: string
  property: Property
  tenure: Tenure
  trades: Trade[]
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
  enablePriorityField: () => void
}

const RaiseWorkOrderForm = (props: Props) => {
  const {
    propertyReference,
    property,
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
    enablePriorityField,
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

  const [priorityCode, setPriorityCode] = useState<number>()
  const [totalCost, setTotalCost] = useState('')
  const overSpendLimit = totalCost > raiseLimit

  const onSubmit = async (formData) => {
    const priority = getPriorityObjectByCode(formData.priorityCode)

    const scheduleWorkOrderFormData = buildScheduleWorkOrderFormData({
      ...formData,
      propertyReference,
      shortAddress: property?.address.shortAddress,
      postalCode: property?.address.postalCode,
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

        setPriorityCode(
          getPriorityObjectByDescription(description)?.priorityCode
        )

        setValue(
          'priorityCode',
          getPriorityObjectByDescription(description)?.priorityCode
        )
      }
    } else {
      console.error(
        `Priority: "${description}" is not included in the available priorities list`
      )
    }
  }

  return (
    <>
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l lbh-caption">New repair</span>
          <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
            {property?.hierarchyType.subTypeDescription}:{' '}
            {property?.address.addressLine}
          </h1>

          <PropertyFlagsWrapper
            canRaiseRepair={property?.canRaiseRepair}
            tenure={tenure}
            propertyReference={propertyReference}
          />

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
              formState={formState}
              enablePriorityField={enablePriorityField}
            />

            <SelectPriority
              priorities={priorities}
              onPrioritySelect={onPrioritySelect}
              register={register}
              errors={errors}
              priorityCode={priorityCode}
              isPriorityEnabled={isPriorityEnabled}
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

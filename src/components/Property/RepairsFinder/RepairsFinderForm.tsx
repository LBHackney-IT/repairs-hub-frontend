import { useForm } from 'react-hook-form'
import BackButton from '../../Layout/BackButton'
import { PrimarySubmitButton, TextInput } from '../../Form'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import { buildScheduleWorkOrderFormData } from '@/utils/hact/workOrderSchedule/raiseWorkOrderForm'
import { IMMEDIATE_PRIORITY_CODE } from '@/utils/helpers/priorities'
import { daysInHours } from '@/utils/time'
import {
  Address,
  HierarchyType,
  Tenure,
} from '@/root/src/models/propertyTenure'
import { Priority } from '@/root/src/models/priority'
import { getPriorityObjectByCode } from './helpers'
import RepairsFinderInput from './RepairsFinderInput'
import { useIsOverSpendLimit } from './useIsOverSpendLimit'
import PropertyFlagsWrapper from '../../PropertyFlagsWrapper/PropertyFlagsWrapper'

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

  const {
    register,
    handleSubmit,
    errors,
    trigger,
    formState: { isSubmitted },
  } = useForm()

  const [overSpendLimit, setTotalCost] = useIsOverSpendLimit(raiseLimit)

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

    onFormSubmit(scheduleWorkOrderFormData)
  }

  return (
    <>
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l lbh-caption">New repair</span>
          <h1 className="lbh-heading-h1 govuk-!-margin-bottom-2">
            {hierarchyType?.subTypeDescription}: {address?.addressLine}
          </h1>

          <PropertyFlagsWrapper
            canRaiseRepair={canRaiseRepair}
            tenure={tenure}
            propertyReference={propertyReference}
          />

          <h2 className="lbh-heading-h2 govuk-!-margin-top-6">
          Work order details
          </h2>
          <form
            role="form"
            id="repair-request-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <RepairsFinderInput
              propertyReference={propertyReference}
              register={register}
              errors={errors}
              setTotalCost={setTotalCost as (cost: number) => void}
              setContractorReference={setContractorReference}
              setTradeCode={setTradeCode}
              priorities={priorities}
              trigger={trigger}
              isSubmitted={isSubmitted}
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

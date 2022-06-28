import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import TenureDetails from '../TenureDetails'
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

const RaiseWorkOrderForm = ({
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
  contacts,
  onFormSubmit,
  raiseLimit,
}) => {
  const { register, handleSubmit, errors, setValue, getValues } = useForm({
    defaultValues: { ...formState },
  })

  const [loading, setLoading] = useState(false)
  const [legalDisrepairError, setLegalDisRepairError] = useState()
  const [priorityCode, setPriorityCode] = useState()

  const [totalCost, setTotalCost] = useState('')
  const [isInLegalDisrepair, setIsInLegalDisrepair] = useState()
  const overSpendLimit = totalCost > raiseLimit

  useEffect(() => {
    const atLeastOneSor = (getValues() &&
    getValues().rateScheduleItems && getValues().rateScheduleItems
    && getValues().rateScheduleItems[0].code != "")
    if (atLeastOneSor && sorCodeArrays.length > 0) {
      const b = Array.isArray(sorCodeArrays[sorCodeArrays.length - 1])
      if (b && sorCodeArrays[sorCodeArrays.length - 1].length > 0
            && sorCodeArrays[sorCodeArrays.length - 1][0].priority) {
        const prio = sorCodeArrays[sorCodeArrays.length - 1][0].priority;
        setPriorityCode(
          prio.priorityCode
        )
        setValue(
          'priorityCode',
          prio.priorityCode
        )}
    }
  })

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

    onFormSubmit(scheduleWorkOrderFormData)
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

  const getPriorityObjectByDescription = (description) => {
    return priorities.find((priority) => priority.description === description)
  }

  const getPriorityObjectByCode = (code) => {
    return priorities.find((priority) => priority.priorityCode == code)
  }

  const onPrioritySelect = (code) => {
    console.log('selected')
    console.log(code)
    setPriorityCode(code)
  }

  const updatePriority = (
    description,
    code,
    rateScheduleItemsLength,
    existingHigherPriorityCode
  ) => {
    console.log("Update priority")
    console.log(description)
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
      console.log('PRIORITY')
      console.log(priorityCode)
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

    console.log("disabling")

    getPropertyInfoOnLegalDisrepair(propertyReference)
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

          {loading ? <Spinner /> : renderLegalDisrepair(isInLegalDisrepair)}

          {legalDisrepairError && <ErrorMessage label={legalDisrepairError} />}

          <div className="lbh-body-s">
            <TenureDetails
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
              isContractorUpdatePage={false}
              updatePriority={updatePriority}
              getPriorityObjectByCode={getPriorityObjectByCode}
              setTotalCost={setTotalCost}
              setValue={setValue}
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

            <Contacts contacts={contacts} />

            <WarningInfoBox
              name="contact-number-warning"
              header="Need to add an additional contact number?"
              text="Any additional contact numbers can be added into the Repair description field"
            />

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

            <PrimarySubmitButton label="Create work order" />
          </form>
        </div>
      </div>
    </>
  )
}

RaiseWorkOrderForm.propTypes = {
  propertyReference: PropTypes.string.isRequired,
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  tenure: PropTypes.object,
  trades: PropTypes.array.isRequired,
  contractors: PropTypes.array.isRequired,
  setContractors: PropTypes.func.isRequired,
  budgetCodes: PropTypes.array.isRequired,
  setBudgetCodes: PropTypes.func.isRequired,
  sorCodeArrays: PropTypes.array.isRequired,
  setSorCodeArrays: PropTypes.func.isRequired,
  priorities: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  tradeCode: PropTypes.string.isRequired,
  setTradeCode: PropTypes.func.isRequired,
  contractorReference: PropTypes.string.isRequired,
  setContractorReference: PropTypes.func.isRequired,
  budgetCodeId: PropTypes.string.isRequired,
  setBudgetCodeId: PropTypes.func.isRequired,
}

export default RaiseWorkOrderForm

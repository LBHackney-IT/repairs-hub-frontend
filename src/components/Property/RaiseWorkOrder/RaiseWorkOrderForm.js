import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TenureDetails from '../TenureDetails'
import BackButton from '../../Layout/BackButton'
import {
  Select,
  PrimarySubmitButton,
  CharacterCountLimitedTextArea,
  TextInput,
} from '../../Form'
import TradeContractorRateScheduleItemView from './TradeContractorRateScheduleItemView'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import { buildScheduleWorkOrderFormData } from '@/utils/hact/workOrderSchedule/raiseWorkOrderForm'

const RaiseWorkOrderForm = ({
  propertyReference,
  address,
  hierarchyType,
  canRaiseRepair,
  locationAlerts,
  personAlerts,
  tenure,
  priorities,
  trades,
  contacts,
  onFormSubmit,
  raiseLimit,
}) => {
  const { register, handleSubmit, errors, setValue } = useForm()
  const [priorityCode, setPriorityCode] = useState('')

  const [totalCost, setTotalCost] = useState('')
  const overSpendLimit = totalCost > raiseLimit

  const onSubmit = async (formData) => {
    const priority = getPriorityObjectByCode(formData.priorityCode)

    const scheduleWorkOrderFormData = buildScheduleWorkOrderFormData({
      ...formData,
      priorityDescription: priority.description,
      daysToComplete: priority.daysToComplete,
    })

    onFormSubmit(scheduleWorkOrderFormData)
  }

  const getPriorityObjectByDescription = (description) => {
    return priorities.find((priority) => priority.description === description)
  }

  const getPriorityObjectByCode = (code) => {
    return priorities.find((priority) => priority.priorityCode == code)
  }

  const onPrioritySelect = (event) => {
    setPriorityCode(parseInt(event.target.value))
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
            {hierarchyType.subTypeDescription}: {address.addressLine}
          </h1>

          <div className="lbh-body-s">
            <TenureDetails
              canRaiseRepair={canRaiseRepair}
              tenure={tenure}
              locationAlerts={locationAlerts}
              personAlerts={personAlerts}
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
              propertyReference={propertyReference}
              register={register}
              errors={errors}
              isContractorUpdatePage={false}
              updatePriority={updatePriority}
              getPriorityObjectByCode={getPriorityObjectByCode}
              setTotalCost={setTotalCost}
            />
            <Select
              name="priorityCode"
              label="Task priority"
              options={priorities.map((priority) => ({
                text: priority.description,
                value: priority.priorityCode.toString(),
              }))}
              onChange={onPrioritySelect}
              disabled={true}
              required={true}
              register={register({
                required: 'Please select a priority',
                validate: (value) =>
                  priorities
                    .map((p) => p.priorityCode)
                    .includes(parseInt(value)) || 'Priority is not valid',
              })}
              error={errors && errors.priorityCode}
              widthClass="govuk-!-width-full"
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
            <input
              id="propertyReference"
              name="propertyReference"
              label="propertyReference"
              type="hidden"
              value={propertyReference}
              ref={register}
            />
            <input
              id="shortAddress"
              name="shortAddress"
              label="shortAddress"
              type="hidden"
              value={address.shortAddress}
              ref={register}
            />
            <input
              id="postalCode"
              name="postalCode"
              label="postalCode"
              type="hidden"
              value={address.postalCode}
              ref={register}
            />
            <Contacts contacts={contacts} />
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
              label="Contact number"
              required={true}
              register={register({
                required: 'Please add contact number',
              })}
              error={errors && errors.contactNumber}
            />

            {overSpendLimit && (
              <WarningText text="The work order cost exceeds the approved spending limit and will be sent to a manager for authorisation" />
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
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object,
  trades: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
}

export default RaiseWorkOrderForm

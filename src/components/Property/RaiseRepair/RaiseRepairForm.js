import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TenureDetails from '../TenureDetails'
import BackButton from '../../Layout/BackButton/BackButton'
import {
  Select,
  PrimarySubmitButton,
  CharacterCountLimitedTextArea,
  TextInput,
} from '../../Form'
import TradeContractorRateScheduleItemView from './TradeContractorRateScheduleItemView'
import Contacts from '../Contacts/Contacts'
import WarningText from '../../Template/WarningText'
import { buildScheduleRepairFormData } from '../../../utils/hact/schedule-repair/raise-repair-form'

const RaiseRepairForm = ({
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
  const { register, handleSubmit, errors } = useForm()
  const [priorityCode, setPriorityCode] = useState('')
  const priorityList = priorities.map((priority) => priority.description)

  const [totalCost, setTotalCost] = useState('')
  const overSpendLimit = totalCost > raiseLimit

  const onSubmit = async (formData) => {
    const scheduleRepairFormData = buildScheduleRepairFormData(formData)

    onFormSubmit(scheduleRepairFormData)
  }

  const getPriorityObjectByDescription = (description) => {
    return priorities.filter(
      (priority) => priority.description == description
    )[0]
  }
  const getPriorityObjectByCode = (code) => {
    return priorities.filter((priority) => priority.priorityCode == code)[0]
  }

  const onPrioritySelect = (event) => {
    const priorityObject = getPriorityObjectByDescription(event.target.value)

    setPriorityCode(priorityObject?.priorityCode)
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

    if (priorityList.includes(description)) {
      const existingCode = parseInt(
        document.getElementById('priorityCode').value
      )
      // Update priority when SOR code has priority attached if:
      // Priority description is blank, or there's only one sor code entry, or
      // when removing an SOR there's an existing entry with higher priority, or
      // the selected priority code is less than existing priority codes
      // (Higher priority as code gets lower)
      if (
        !existingCode ||
        rateScheduleItemsLength <= 1 ||
        existingHigherPriorityCode ||
        code < existingCode
      ) {
        if (errors?.priorityDescription) {
          delete errors.priorityDescription
        }

        document.getElementById('priorityDescription').value = description

        setPriorityCode(
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
            Repair task details
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
              name="priorityDescription"
              label="Task priority"
              options={priorityList}
              onChange={onPrioritySelect}
              disabled={true}
              required={true}
              register={register({
                required: 'Please select a priority',
                validate: (value) =>
                  priorityList.includes(value) || 'Priority is not valid',
              })}
              error={errors && errors.priorityDescription}
              widthClass="govuk-!-width-full"
            />
            <input
              id="priorityCode"
              name="priorityCode"
              label="priorityCode"
              type="hidden"
              value={priorityCode}
              ref={register}
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
              <WarningText text="The works order cost exceeds the approved spending limit and will be sent to a manager for authorisation" />
            )}

            <PrimarySubmitButton label="Create works order" />
          </form>
        </div>
      </div>
    </>
  )
}

RaiseRepairForm.propTypes = {
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

export default RaiseRepairForm

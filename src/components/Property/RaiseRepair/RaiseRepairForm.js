import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TenureAlertDetails from '../TenureAlertDetails'
import BackButton from '../../Layout/BackButton/BackButton'
import { Select, Button, TextArea, TextInput } from '../../Form'
import { buildScheduleRepairFormData } from '../../../utils/hact/schedule-repair/raise-repair-form'
import SorCodeSelectView from './SorCodeSelectView'

const RaiseRepairForm = ({
  propertyReference,
  address,
  hierarchyType,
  canRaiseRepair,
  locationAlerts,
  personAlerts,
  tenure,
  sorCodes,
  priorities,
  onFormSubmit,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const [priorityCode, setPriorityCode] = useState('')
  const priorityList = priorities.map((priority) => priority.description)

  const onSubmit = async (formData) => {
    const scheduleRepairFormData = buildScheduleRepairFormData(formData)

    onFormSubmit(scheduleRepairFormData)
  }

  const onPrioritySelect = (event) => {
    const priorityObject = priorities.filter(
      (priority) => priority.description == event.target.value
    )[0]

    setPriorityCode(priorityObject?.priorityCode)
  }

  const characterCount = () => {
    const characterCount = document.getElementById('character-count')
    const maxLength = characterCount.dataset.maximumLength

    characterCount.innerText = maxLength - event.target.value.length
  }

  return (
    <div className="govuk-width-container">
      <BackButton />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">New repair</span>
          <h1 className="govuk-heading-l govuk-!-margin-bottom-2">
            {hierarchyType.subTypeDescription}: {address.addressLine}
          </h1>

          <div className="govuk-body-s">
            <TenureAlertDetails
              canRaiseRepair={canRaiseRepair}
              tenure={tenure}
              locationAlerts={locationAlerts}
              personAlerts={personAlerts}
            />
          </div>

          <h2 className="govuk-heading-m govuk-!-margin-top-6">
            Repair task details
          </h2>

          <form
            role="form"
            id="repair-request-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <SorCodeSelectView
              sorCodes={sorCodes}
              register={register}
              errors={errors}
            />

            <Select
              name="priorityDescription"
              label="Task priority"
              options={priorityList}
              onChange={onPrioritySelect}
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
            <TextArea
              name="descriptionOfWork"
              label="Repair description"
              onKeyUp={characterCount}
              required={true}
              register={register({
                required: 'Please enter a repair description',
                maxLength: {
                  value: 250,
                  message: 'You have exceeded the maximum amount of characters',
                },
              })}
              error={errors && errors.descriptionOfWork}
            />
            <span className="govuk-hint govuk-!-margin-bottom-6">
              You have{' '}
              <span id="character-count" data-maximum-length="250">
                250
              </span>{' '}
              characters remaining.
            </span>
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
            <TextInput
              name="callerName"
              label="Caller name"
              required={false}
              register={register({
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
              required={false}
              register={register({
                pattern: {
                  value: /^[0-9]*$/,
                  message: 'Contact number is not valid',
                },
              })}
              error={errors && errors.contactNumber}
            />
            <Button label="Create works order" type="submit" />
          </form>
        </div>
      </div>
    </div>
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
  sorCodes: PropTypes.array.isRequired,
  priorities: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
}

export default RaiseRepairForm

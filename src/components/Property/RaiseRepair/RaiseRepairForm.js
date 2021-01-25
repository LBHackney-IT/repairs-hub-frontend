import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import TenureAlertDetails from '../TenureAlertDetails'
import BackButton from '../../Layout/BackButton/BackButton'
import { Select, Button, TextArea, TextInput } from '../../Form'
import { buildRaiseRepairFormData } from '../../../utils/hact/raise-repair-form'
import { GridRow, GridColumn } from '../../Layout/Grid'

const RaiseRepairForm = ({
  address,
  hierarchyType,
  canRaiseRepair,
  locationAlerts,
  personAlerts,
  tenure,
  sorCodes,
  onFormSubmit,
}) => {
  const { register, handleSubmit, errors } = useForm()
  const [priorityCode, setPriorityCode] = useState('')
  const [sorCodeDescription, setSorCodeDescription] = useState('')
  const sorCodesList = sorCodes.map((code) => code.customCode)
  const priorityList = [
    ...new Set(sorCodes.map((code) => code.priority.description)),
  ]

  const onSubmit = async (formData) => {
    console.log(formData)
    const raiseRepairFormData = buildRaiseRepairFormData(formData)

    onFormSubmit(raiseRepairFormData)
  }

  const onPrioritySelect = (priority) => {
    const sorCodeObject = sorCodes.filter(
      (a) => a.priority.description == priority
    )[0]

    setPriorityCode(sorCodeObject?.priority.priorityCode || '')
  }
  const onSorCodeSelect = (code) => {
    const sorCodeObject = sorCodes.filter((a) => a.customCode == code)[0]
    const sorCodeDescription = sorCodeObject?.customName || ''

    if (code) {
      document.getElementById('priorityDescription').value =
        sorCodeObject?.priority.description

      if (errors?.priorityDescription) {
        delete errors.priorityDescription
      }
    }

    setPriorityCode(sorCodeObject?.priority.priorityCode || '')
    setSorCodeDescription(sorCodeDescription)
    addSorCodeSummaryHtml(sorCodeDescription)
  }

  const addSorCodeSummaryHtml = (sorCodeName) => {
    const sorCodeSummaryHtml = `<p class='govuk-body-s'>SOR code summary: ${sorCodeName}</p>`
    const targetNextSibling = event.target.nextSibling

    if (!targetNextSibling) {
      const sorCodeSummaryDiv = [
        '<div class="sor-code-summary govuk-!-margin-top-2">',
        `${sorCodeSummaryHtml}`,
        '</div>',
      ].join('\n')

      return event.target.insertAdjacentHTML('afterend', sorCodeSummaryDiv)
    }

    if (sorCodeName) {
      targetNextSibling.innerHTML = sorCodeSummaryHtml
    } else {
      targetNextSibling.remove()
    }
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
            <GridRow>
              <GridColumn width="two-thirds">
                <Select
                  name="sorCode"
                  label="SOR Code"
                  options={sorCodesList}
                  onChange={onSorCodeSelect}
                  register={register({
                    required: 'Please select an SOR code',
                    validate: (value) =>
                      sorCodesList.includes(value) || 'SOR code is not valid',
                  })}
                  error={errors && errors.sorCode}
                  widthClass="govuk-!-width-full"
                />
                <input
                  id="sorCodeDescription"
                  name="sorCodeDescription"
                  type="hidden"
                  value={sorCodeDescription}
                  ref={register}
                />
              </GridColumn>
              <GridColumn width="one-third">
                <TextInput
                  name="quantity"
                  label="Quantity"
                  error={errors && errors.quantity}
                  widthClass="govuk-!-width-full"
                  register={register({
                    required: 'Please enter a quantity',
                    valueAsNumber: true,
                    validate: (value) => {
                      if (!Number.isInteger(value)) {
                        return 'Quantity must be a whole number'
                      }
                      if (value < 1) {
                        return 'Quantity must be 1 or more'
                      } else if (value > 50) {
                        return 'Quantity must be 50 or less'
                      } else {
                        return true
                      }
                    },
                  })}
                />
              </GridColumn>
            </GridRow>
            <Select
              name="priorityDescription"
              label="Task priority"
              options={priorityList}
              onChange={onPrioritySelect}
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
            <Button label="Create works order" type="submit" />
          </form>
        </div>
      </div>
    </div>
  )
}

RaiseRepairForm.propTypes = {
  address: PropTypes.object.isRequired,
  hierarchyType: PropTypes.object.isRequired,
  canRaiseRepair: PropTypes.bool.isRequired,
  locationAlerts: PropTypes.array.isRequired,
  personAlerts: PropTypes.array.isRequired,
  tenure: PropTypes.object.isRequired,
  sorCodes: PropTypes.array.isRequired,
}

export default RaiseRepairForm

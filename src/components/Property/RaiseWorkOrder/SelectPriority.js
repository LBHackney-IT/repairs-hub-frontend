import PropTypes from 'prop-types'
import { Select } from '../../Form'
import { useState } from 'react'
import WarningInfoBox from '../../Template/WarningInfoBox'
import {
  PLANNED_PRIORITY_CODE,
  VOIDS_MAJOR_PRIORITY_CODE,
  VOIDS_MINOR_PRIORITY_CODE,
} from '@/utils/helpers/priorities'

const SelectPriority = ({
  priorities,
  onPrioritySelect,
  register,
  errors,
  priorityCode,
  priorityCodesWithoutDrs,
}) => {
  const [drsScheduled, setDrsScheduled] = useState(
    priorityCodesWithoutDrs.includes(priorityCode)
  )
  const [selectedPriority, setSelectedPriority] = useState(priorityCode)

  const onSelect = (e) => {
    const selectedCode = parseInt(e.target.value)
    setDrsScheduled(priorityCodesWithoutDrs.includes(selectedCode))
    onPrioritySelect(selectedCode)
    setSelectedPriority(selectedCode)
  }

  const generatePriorityWarningHeader = (selectedPriority) => {
    switch (selectedPriority) {
      case PLANNED_PRIORITY_CODE:
        return 'Planned priority'

      case VOIDS_MAJOR_PRIORITY_CODE:
      case VOIDS_MINOR_PRIORITY_CODE:
        return 'VOIDS priority'

      default:
        return 'Adaptations priority'
    }
  }

  const generatePriorityWarningText = (selectedPriority) => {
    const baseText = 'work orders do not go to the DRS booking system'

    switch (selectedPriority) {
      case PLANNED_PRIORITY_CODE:
        return `Planned ${baseText}`

      case VOIDS_MAJOR_PRIORITY_CODE:
      case VOIDS_MINOR_PRIORITY_CODE:
        return `VOIDS ${baseText}`

      default:
        return `Adaptation ${baseText}`
    }
  }

  return (
    <>
      <Select
        name="priorityCode"
        label="Task priority"
        options={priorities.map((priority) => ({
          text: priority.description,
          value: priority.priorityCode.toString(),
        }))}
        onChange={onSelect}
        disabled={true}
        required={true}
        register={register({
          required: 'Please select a priority',
          validate: (value) =>
            priorities.map((p) => p.priorityCode).includes(parseInt(value)) ||
            'Priority is not valid',
        })}
        error={errors && errors.priorityCode}
        widthClass="govuk-!-width-full"
      />
      {drsScheduled && (
        <>
          <br />
          <WarningInfoBox
            header={generatePriorityWarningHeader(selectedPriority)}
            text={generatePriorityWarningText(selectedPriority)}
          />
        </>
      )}
    </>
  )
}

SelectPriority.propTypes = {
  priorities: PropTypes.array.isRequired,
  onPrioritySelect: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  priorityCode: PropTypes.number,
}

export default SelectPriority

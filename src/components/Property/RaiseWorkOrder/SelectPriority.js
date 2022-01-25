import PropTypes from 'prop-types'
import { Select } from '../../Form'
import { useState } from 'react'
import WarningInfoBox from '../../Template/WarningInfoBox'

const SelectPriority = ({
  priorities,
  onPrioritySelect,
  register,
  errors,
  priorityCode,
  priorityCodesWithoutDrs,
}) => {
  const [drsScheduled, setDrsScheduled] = useState(false)

  const onSelect = (e) => {
    setDrsScheduled(priorityCodesWithoutDrs.includes(e.target.value))
    onPrioritySelect(e)
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
            priorities
              .map((p) => p.priorityCode)
              .includes(parseInt(value)) || 'Priority is not valid',
        })}
        error={errors && errors.priorityDescription}
        widthClass="govuk-!-width-full"
      />
      {(drsScheduled || priorityCode == '5') && (
        <>
          <br />
          <WarningInfoBox
            header="Planned priority"
            text="Planned work order don't go to DRS booking system"
          />
        </>
      )}
    </>
  )
}

SelectPriority.propTypes = {
  priorityList: PropTypes.array.isRequired,
  onPrioritySelect: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  priorityCode: PropTypes.string.isRequired,
}

export default SelectPriority

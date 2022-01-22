import PropTypes from 'prop-types'
import { Select } from '../../Form'
import WarningInfoBox from '../../Template/WarningInfoBox'

const SelectPriority = ({
  priorityList,
  onPrioritySelect,
  register,
  errors,
  priorityCode,
}) => {
  const PLANNED_PRIORITY = 5
  console.log('we have priority now')
  console.log(priorityCode)
  return (
    <>
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
      {priorityCode == PLANNED_PRIORITY && (
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

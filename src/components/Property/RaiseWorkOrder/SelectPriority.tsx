import { Select } from '../../Form'
import { useState } from 'react'
import WarningInfoBox from '../../Template/WarningInfoBox'
import {
  PLANNED_PRIORITY_CODE,
  PRIORITY_CODES_WITHOUT_DRS,
  VOIDS_MAJOR_PRIORITY_CODE,
  VOIDS_MINOR_PRIORITY_CODE,
} from '@/utils/helpers/priorities'
import { Priority } from '@/root/src/models/priority'
import { DeepMap, FieldError } from 'react-hook-form'

const gasBreakdownContractor = 'H04'

interface Props {
  priorities: Priority[]
  onPrioritySelect: (code: any) => void
  register: any
  errors: DeepMap<any, FieldError>
  priorityCode: number
  isPriorityEnabled: boolean
  contractorReference: string
}

const SelectPriority = (props: Props) => {
  const {
    isPriorityEnabled,
    priorities,
    onPrioritySelect,
    register,
    errors,
    priorityCode,
    contractorReference,
  } = props

  const canScheduleWithDrs = (selectedCode: number) => {
    // Special case allow planned maintenance to be scheduled with DRS
    // if contractor is H04
    if (contractorReference === gasBreakdownContractor && selectedCode === PLANNED_PRIORITY_CODE)
      return true

    // return false if priority doesnt go to drs
    return !PRIORITY_CODES_WITHOUT_DRS.has(selectedCode)
  }

  const [showCantUseDrsWarning, setShowCantUseDrsWarning] = useState(
    !canScheduleWithDrs(priorityCode)
  )
  const [selectedPriority, setSelectedPriority] = useState(priorityCode)

  const onSelect = (e) => {
    const selectedCode = parseInt(e.target.value)

    setShowCantUseDrsWarning(!canScheduleWithDrs(selectedCode))

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
        disabled={!isPriorityEnabled}
        required={true}
        register={register({
          required: 'Please select a priority',
          validate: (value) =>
            priorities.map((p) => p.priorityCode).includes(parseInt(value)) ||
            'Priority is not valid',
        })}
        error={errors && errors.priorityCode}
        widthClass="govuk-!-width-full"
        hint={undefined}
        children={undefined}
        ignoreValue={undefined}
        defaultValue={undefined}
        value={undefined}
      />
      {showCantUseDrsWarning && (
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

export default SelectPriority

import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormMethods,
} from 'react-hook-form'
import Radio from '../../Form/Radios'

interface Props {
  register: UseFormMethods['register']
  errors:
    | DeepMap<FieldValues, FieldError>
    | { [key: string]: { message: string } }
  followOnData?: { supervisorCalled: boolean }
  hasWhiteBackground?: boolean
}

const FollowOnRequestMaterialsSupervisorCalledForm = (props: Props) => {
  const { register, errors, followOnData, hasWhiteBackground } = props

  const options = [
    {
      value: 'Yes',
      text: 'Yes',
      hint: null,
      // needs to re-populate form value on uncontrolled fields
      defaultChecked: followOnData?.supervisorCalled === true,
    },
    {
      value: 'No',
      text: 'No',
      hint: null,
      defaultChecked: followOnData?.supervisorCalled === false,
    },
  ]

  return (
    <Radio
      labelSize="s"
      label="Have you called your supervisor?"
      name="supervisorCalled"
      options={options}
      register={register({
        required: 'Please confirm whether you have contacted your supervisor',
      })}
      error={errors && errors.supervisorCalled}
      hasWhiteBackground={hasWhiteBackground}
    />
  )
}

export default FollowOnRequestMaterialsSupervisorCalledForm

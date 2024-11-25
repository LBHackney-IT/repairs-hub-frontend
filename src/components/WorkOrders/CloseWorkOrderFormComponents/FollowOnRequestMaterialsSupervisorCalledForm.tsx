import Radios from '../../Form/Radios'

interface Props {
  register: any
  errors: { [key: string]: { message: string } }
  followOnData?: { supervisorCalled: boolean }
}

const FollowOnRequestMaterialsSupervisorCalledForm = (props: Props) => {
  const { register, errors, followOnData } = props

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
    <Radios
      labelSize="s"
      label="Have you called your supervisor?"
      name="supervisorCalled"
      options={options}
      register={register({
        required: 'Please confirm whether you have contacted your supervisor',
      })}
      error={errors && errors.supervisorCalled}
    />
  )
}

export default FollowOnRequestMaterialsSupervisorCalledForm

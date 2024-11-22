import { validate } from 'uuid'
import Radios from '../../Form/Radios'

const FollowOnRequestMaterialsSupervisorCalledForm = (props) => {
  const { register, errors } = props

  return (
    <Radios
      labelSize="s"
      label="Have you called your supervisor?"
      name="supervisorCalled"
      options={['Yes', 'No']}
      register={register({
        required: 'Please confirm whether you have contacted your supervisor',
      })}
      error={errors && errors.supervisorCalled}
    />
  )
}

export default FollowOnRequestMaterialsSupervisorCalledForm

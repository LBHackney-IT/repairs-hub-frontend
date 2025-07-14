import { FOLLOW_ON_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'
import { FieldError, UseFormMethods } from 'react-hook-form'

interface Props {
  error: FieldError | { message: string } | null
  visible: boolean
  register: UseFormMethods['register']
  followOnStatus: string
}

const FurtherWorkRadio = (props: Props) => {
  const { error, visible, register, followOnStatus } = props

  if (!visible) return null

  return (
    <Radios
      name="followOnStatus"
      options={FOLLOW_ON_STATUS_OPTIONS.map((x) => {
        return {
          ...x,
          defaultChecked: x.value === followOnStatus,
        }
      })}
      register={register({
        required: 'Please confirm if further work is required',
      })}
      error={error}
    />
  )
}

export default FurtherWorkRadio

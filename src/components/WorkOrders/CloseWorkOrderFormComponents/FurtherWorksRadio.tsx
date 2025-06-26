import { FOLLOW_ON_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import { FieldError } from 'react-hook-form'
import Radio from '../../Form/Radios'

interface Props {
  error?: FieldError
  visible: boolean
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
}

const FurtherWorkRadio = (props: Props) => {
  const { error, visible, register } = props

  if (!visible) return null

  return (
    <Radio
      name="followOnStatus"
      options={FOLLOW_ON_STATUS_OPTIONS}
      register={register({
        required: 'Please confirm if further work is required',
      })}
      error={error}
    />
  )
}

export default FurtherWorkRadio

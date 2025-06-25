import { FOLLOW_ON_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import { FieldError } from 'react-hook-form'
import Radio from '../../Form/Radios'

interface Props {
  error?: FieldError
  visible: boolean
}

const FurtherWorkRadio = (props: Props) => {
  const { error, visible } = props

  if (!visible) return null

  return (
    <Radio
      name="followOnStatus"
      options={FOLLOW_ON_STATUS_OPTIONS}
      error={error}
    />
  )
}

export default FurtherWorkRadio

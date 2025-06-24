import { FOLLOW_ON_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'
import { FieldError } from 'react-hook-form'

interface Props {
  error?: FieldError
  visible: boolean
  checkedValue: string | boolean
  setValue: (name: string, value: unknown) => void
}

const FurtherWorkRadio = (props: Props) => {
  const { error, visible, checkedValue, setValue } = props

  if (!visible) return null

  return (
    <Radios
      name="followOnStatus"
      options={FOLLOW_ON_STATUS_OPTIONS}
      error={error}
      checkedValue={checkedValue}
      onChange={(e) => setValue('followOnStatus', e.target.value)}
    />
  )
}

export default FurtherWorkRadio

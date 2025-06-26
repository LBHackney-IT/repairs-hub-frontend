import { CLOSURE_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import { FieldErrors } from 'react-hook-form'
import { DefaultValues } from '../MobileWorkingCloseWorkOrderForm'
import FurtherWorkRadio from './FurtherWorksRadio'
import Radio from '../../Form/Radios'

interface Props {
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
  errors: FieldErrors<DefaultValues>
  watch: ReturnType<typeof import('react-hook-form')['useForm']>['watch']
  canRaiseAFollowOn: boolean
}

const CloseWorkOrderFormReasonForClosing = (props: Props) => {
  const { register, errors, watch, canRaiseAFollowOn } = props

  const reasonWatchedValue = watch('reason')

  return (
    <Radio
      labelSize="s"
      label="Reason for closing"
      name="reason"
      options={CLOSURE_STATUS_OPTIONS.map((r) => {
        if (canRaiseAFollowOn && r.value === 'Work Order Completed') {
          return {
            ...r,
            children: (
              <FurtherWorkRadio
                error={errors?.followOnStatus}
                visible={reasonWatchedValue === 'Work Order Completed'}
                register={register}
              />
            ),
          }
        }
        return r
      })}
      register={register}
      error={errors && errors.reason}
      // checkedValue={reasonWatchedValue}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

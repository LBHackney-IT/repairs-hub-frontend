import { CLOSURE_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'
import { FieldErrors } from 'react-hook-form'
import { DefaultValues } from '../MobileWorkingCloseWorkOrderForm'
import FurtherWorkRadio from './FurtherWorksRadio'

interface Props {
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
  errors: FieldErrors<DefaultValues>
  watch: ReturnType<typeof import('react-hook-form')['useForm']>['watch']
  canRaiseAFollowOn: boolean
  // setValue: (name: string, value: unknown) => void
}

const CloseWorkOrderFormReasonForClosing = (props: Props) => {
  const { register, errors, canRaiseAFollowOn } = props

  // const reasonWatchedValue = watch('reason')
  // const followOnStatusWatchedValue = watch('followOnStatus')

  return (
    <Radios
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
                visible={true}
                // visible={reasonWatchedValue === 'Work Order Completed'}
                // checkedValue={followOnStatusWatchedValue}
              />
            ),
          }
        }
        return r
      })}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
      // checkedValue={reasonWatchedValue}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

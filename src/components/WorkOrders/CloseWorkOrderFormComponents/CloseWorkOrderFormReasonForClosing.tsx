import { CLOSURE_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import { FieldErrors } from 'react-hook-form'
import { CloseWorkOrderValues } from '../MobileWorkingCloseWorkOrderForm'
import FurtherWorkRadio from './FurtherWorksRadio'
import Radio from '../../Form/Radios'

interface Props {
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
  errors: FieldErrors<CloseWorkOrderValues>
  watch: ReturnType<typeof import('react-hook-form')['useForm']>['watch']
  canRaiseAFollowOn: boolean
}

const CloseWorkOrderFormReasonForClosing = (props: Props) => {
  const { register, errors, watch, canRaiseAFollowOn } = props

  return (
    <Radio
      labelSize="s"
      label="Reason for closing"
      name="reason"
      options={CLOSURE_STATUS_OPTIONS.map((r) => {
        return {
          ...r,
          children: (
            <FurtherWorkRadio
              error={errors?.followOnStatus}
              register={register}
              visible={
                canRaiseAFollowOn &&
                r.value === 'Work Order Completed' &&
                watch('reason') === 'Work Order Completed'
              }
            />
          ),
        }
      })}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

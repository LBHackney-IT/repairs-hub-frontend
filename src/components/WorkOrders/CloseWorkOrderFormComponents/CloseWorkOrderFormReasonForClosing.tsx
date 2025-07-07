import {
  CLOSURE_STATUS_OPTIONS,
  FOLLOW_ON_STATUS_OPTIONS,
} from '@/root/src/utils/statusCodes'
import { FieldErrors } from 'react-hook-form'
import { CloseWorkOrderValues } from '../MobileWorkingCloseWorkOrderForm'
import Radio from '../../Form/Radios'

interface Props {
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
  errors: FieldErrors<CloseWorkOrderValues>
  watch: ReturnType<typeof import('react-hook-form')['useForm']>['watch']
  reason: string
  followOnStatus: 'active' | 'inactive'
  canRaiseAFollowOn: boolean
}

const CloseWorkOrderFormReasonForClosing = (props: Props) => {
  const {
    register,
    errors,
    reason,
    followOnStatus,
    watch,
    canRaiseAFollowOn,
  } = props

  const [visitCompleted, noAccess] = CLOSURE_STATUS_OPTIONS

  const showFurtherWorkRadio =
    canRaiseAFollowOn && watch('reason') === 'Work Order Completed'

  console.log('props:', props)

  return (
    <Radio
      labelSize="s"
      label="Reason for closing"
      name="reason"
      defaultValue={reason}
      options={[
        {
          ...visitCompleted,
          children: showFurtherWorkRadio && (
            <Radio
              name="followOnStatus"
              options={FOLLOW_ON_STATUS_OPTIONS}
              register={register({
                required: 'Please confirm if further work is required',
              })}
              error={errors?.followOnStatus}
              defaultValue={followOnStatus}
            />
          ),
        },
        { ...noAccess },
      ]}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

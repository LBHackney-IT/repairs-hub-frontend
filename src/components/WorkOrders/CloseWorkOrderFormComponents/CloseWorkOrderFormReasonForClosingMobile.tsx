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
  canRaiseAFollowOn: boolean
}

const CloseWorkOrderFormReasonForClosingMobile = (props: Props) => {
  const { register, errors, watch, canRaiseAFollowOn } = props

  const [visitCompleted, noAccess] = CLOSURE_STATUS_OPTIONS

  const showFurtherWorkRadio =
    canRaiseAFollowOn && watch('reason') === 'Work Order Completed'

  return (
    <Radio
      labelSize="s"
      label="Reason for closing"
      name="reason"
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

export default CloseWorkOrderFormReasonForClosingMobile

import {
  CLOSURE_STATUS_OPTIONS,
  FOLLOW_ON_STATUS_OPTIONS,
} from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'

const CloseWorkOrderFormReasonForClosing = (props) => {
  const { register, errors, watch, reason } = props

  const showFollowOnRadioOptions = watch('reason') === 'Work Order Completed'

  return (
    <>
      <Radios
        labelSize="s"
        label="Select reason for closing"
        name="reason"
        options={CLOSURE_STATUS_OPTIONS.map((r) => ({
          ...r,
          defaultChecked: r.value === reason,
          children:
            r.value === 'Work Order Completed' && showFollowOnRadioOptions ? (
              <Radios
                name="followOnStatus"
                options={FOLLOW_ON_STATUS_OPTIONS}
                register={register({
                  required: 'Please confirm if further work is required',
                })}
                error={errors && errors.followOnStatus}
              />
            ) : null,
        }))}
        register={register({
          required: 'Please select a reason for closing the work order',
        })}
        error={errors && errors.reason}
      />
    </>
  )
}

export default CloseWorkOrderFormReasonForClosing

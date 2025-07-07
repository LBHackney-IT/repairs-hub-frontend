import {
  CLOSURE_STATUS_OPTIONS,
  FOLLOW_ON_STATUS_OPTIONS,
} from '@/root/src/utils/statusCodes'
import { FieldErrors } from 'react-hook-form'
import { CloseWorkOrderValues } from '../MobileWorkingCloseWorkOrderForm'
import Radio from '../../Form/Radios'
import { useEffect, useState } from 'react'
import Radios from '../../Form/Radios'

interface Props {
  register: ReturnType<typeof import('react-hook-form')['useForm']>['register']
  errors: FieldErrors<CloseWorkOrderValues>
  watch: ReturnType<typeof import('react-hook-form')['useForm']>['watch']
  reason?: string
  followOnStatus?: 'active' | 'inactive'
  canRaiseAFollowOn: boolean
}

const CloseWorkOrderFormReasonForClosing = (props: Props) => {
  const {
    register,
    errors,
    watch,
    reason,
    followOnStatus,
    canRaiseAFollowOn,
  } = props

  const [showFurtherWorkRadio, setShowFurtherWorkRadio] = useState(false)

  const [visitCompleted, noAccess] = CLOSURE_STATUS_OPTIONS

  const reasonWatchedValue = watch('reason')
  useEffect(() => {
    // When navigating back from summary page, the watch hook isnt updating
    // meaning the followOnStatus options arent visible
    // this awful code fixes that
    if (!canRaiseAFollowOn) {
      console.log('setShowFurtherWorkRadio to false')
      setShowFurtherWorkRadio(false)
    }
    const woCompleted =
      reasonWatchedValue === 'Work Order Completed' ||
      reason === 'Work Order Completed'
    if (woCompleted) {
      console.log(
        `setShowFurtherWorkRadio to true for reason: ${reasonWatchedValue} or ${reason}`
      )
      setShowFurtherWorkRadio(true)
    }
  }, [reasonWatchedValue, reason])

  console.log('props:', props)

  return (
    <Radios
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
              defaultValue={followOnStatus}
            />
          ),
        },
        noAccess,
      ]}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

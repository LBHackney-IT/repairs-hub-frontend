import { CLOSURE_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'
import { useEffect, useState } from 'react'
import FurtherWorkRadio from './FurtherWorksRadio'
import { FieldErrors, UseFormMethods } from 'react-hook-form/dist/types'
import { CloseWorkOrderValues } from '../MobileWorkingCloseWorkOrderForm'

interface Props {
  register: UseFormMethods['register']
  errors: FieldErrors<CloseWorkOrderValues>
  watch: UseFormMethods['watch']
  defaultValues?: {
    reason: string
    followOnStatus: 'active' | 'inactive'
  }
  canRaiseAFollowOn: boolean
}

const CloseWorkOrderFormReasonForClosing = (props: Props) => {
  const { register, errors, watch, defaultValues, canRaiseAFollowOn } = props
  const { reason, followOnStatus } = defaultValues || {}

  const [showFurtherWorkRadio, setShowFurtherWorkRadio] = useState(false)

  const reasonWatchedValue = watch('reason')

  useEffect(() => {
    // When navigating back from summary page, the watch hook isnt updating
    // meaning the followOnStatus options arent visible
    // this awful code fixes that
    // ideally it should be managed by the form state

    if (reasonWatchedValue === undefined) {
      setShowFurtherWorkRadio(reason === 'Work Order Completed')
    } else {
      setShowFurtherWorkRadio(reasonWatchedValue === 'Work Order Completed')
    }
  }, [reasonWatchedValue])

  const [visitCompleted, noAccess] = CLOSURE_STATUS_OPTIONS

  return (
    <Radios
      labelSize="s"
      label="Reason for closing"
      name="reason"
      options={[
        {
          text: visitCompleted.text,
          value: visitCompleted.value,
          defaultChecked: visitCompleted.value === reason,
          children: (
            <FurtherWorkRadio
              error={errors?.followOnStatus}
              visible={canRaiseAFollowOn && showFurtherWorkRadio}
              register={register}
              followOnStatus={followOnStatus}
            />
          ),
        },
        {
          text: noAccess.text,
          value: noAccess.value,
          defaultChecked: noAccess.value === reason,
        },
      ]}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

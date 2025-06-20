import { CLOSURE_STATUS_OPTIONS } from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'
import { useEffect, useState } from 'react'
import FurtherWorkRadio from './FurtherWorksRadio'
import { DeepMap, DefaultValues, FieldError } from 'react-hook-form/dist/types'

interface Props {
  register: any
  errors: DeepMap<DefaultValues<Record<string, unknown>>, FieldError>
  watch: any
  reason?: string
  followOnStatus?: string
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

  const reasonWatchedValue = watch('reason')

  useEffect(() => {
    // When navigating back from summary page, the watch hook isnt updating
    // meaning the followOnStatus options arent visible
    // this awful code fixes that

    if (reasonWatchedValue === undefined) {
      setShowFurtherWorkRadio(reason === 'Work Order Completed')
    } else {
      setShowFurtherWorkRadio(reasonWatchedValue === 'Work Order Completed')
    }
  }, [reasonWatchedValue])

  return (
    <Radios
      labelSize="s"
      label="Reason for closing"
      name="reason"
      options={CLOSURE_STATUS_OPTIONS.map((r) => ({
        ...r,
        defaultChecked: r.value === reason,
        children: canRaiseAFollowOn ? (
          r.value === 'Work Order Completed' ? (
            <FurtherWorkRadio
              error={errors?.followOnStatus}
              register={register}
              visible={showFurtherWorkRadio}
              followOnStatus={followOnStatus}
            />
          ) : null
        ) : null,
      }))}
      register={register({
        required: 'Please select a reason for closing the work order',
      })}
      error={errors && errors.reason}
    />
  )
}

export default CloseWorkOrderFormReasonForClosing

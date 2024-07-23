import {
  CLOSURE_STATUS_OPTIONS,
  // FOLLOW_ON_STATUS_OPTIONS,
} from '@/root/src/utils/statusCodes'
import Radios from '../../Form/Radios'
// import { useEffect, useState } from 'react'

// const FurtherWorkRadio = (props) => {
//   const { errors, visible, register, followOnStatus } = props

//   if (!visible) return null

//   return (
//     <Radios
//       name="followOnStatus"
//       options={FOLLOW_ON_STATUS_OPTIONS.map((x) => {
//         return {
//           ...x,
//           defaultChecked: x.value === followOnStatus,
//         }
//       })}
//       register={register({
//         required: 'Please confirm if further work is required',
//       })}
//       error={errors && errors.followOnStatus}
//     />
//   )
// }

const CloseWorkOrderFormReasonForClosing = (props) => {
  const {
    register,
    errors,
    // watch,
    reason,
    // followOnData,
    // followOnStatus,
  } = props

  // const [showFurtherWorkRadio, setShowFurtherWorkRadio] = useState(false)

  // const reasonWatchedValue = watch('reason')

  // useEffect(() => {
  //   // When navigating back from summary page, the watch hook isnt updating
  //   // meaning the followOnStatus options arent visible
  //   // this awful code fixes that

  //   if (reasonWatchedValue === undefined) {
  //     setShowFurtherWorkRadio(reason === 'Work Order Completed')
  //   } else {
  //     setShowFurtherWorkRadio(reasonWatchedValue === 'Work Order Completed')
  //   }
  // }, [reasonWatchedValue])

  return (
    <>
      <Radios
        labelSize="s"
        label="Select reason for closing"
        name="reason"
        options={CLOSURE_STATUS_OPTIONS.map((r) => ({
          ...r,
          defaultChecked: r.value === reason,
          // children:
          //   r.value === 'Work Order Completed' ? (
          //     <FurtherWorkRadio
          //       errors={errors}
          //       register={register}
          //       visible={showFurtherWorkRadio}
          //       followOnData={followOnData}
          //       followOnStatus={followOnStatus}
          //     />
          //   ) : null,
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

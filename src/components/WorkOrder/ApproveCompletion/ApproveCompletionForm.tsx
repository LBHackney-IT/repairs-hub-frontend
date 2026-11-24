import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { TextArea, PrimarySubmitButton } from '../../Form'
import { approveWorkOrderCompletion } from '@/root/src/utils/requests/workOrders'

interface Props {
  workOrderReference: string
  onApproved: () => void
}

interface FormValues {
  note: string
}

const ApproveCompletionForm = ({ workOrderReference, onApproved }: Props) => {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { handleSubmit, register, errors } = useForm<FormValues>({
    mode: 'onChange',
  })

  const onSubmitForm = async ({ note }: FormValues) => {
    setSubmitting(true)
    setError(null)

    const approveResponse = await approveWorkOrderCompletion(
      workOrderReference,
      note
    )

    if (approveResponse.success) {
      onApproved()
      return
    }

    setError(approveResponse.error.message)
    setSubmitting(false)
  }

  return (
    <>
      <form role="form" onSubmit={handleSubmit(onSubmitForm)}>
        <p className="lbh-body">
          Approving will complete this work order. It will then be updated in
          bonus calculation.
        </p>
        <TextArea
          name="note"
          label="Add notes (optional)"
          register={register}
          error={errors && errors.note}
        />
        <PrimarySubmitButton label="Approve completion" disabled={submitting} />
      </form>

      {submitting && <Spinner />}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default ApproveCompletionForm

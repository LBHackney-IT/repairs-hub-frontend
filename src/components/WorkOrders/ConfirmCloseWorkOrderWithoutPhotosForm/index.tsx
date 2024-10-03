import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../../Errors/ErrorMessage'
import { PrimarySubmitButton, Radio, TextArea } from '../../Form'

interface Props {
  onSubmit: (data: { reason: string; comments: string }) => void
}

const FORM_OPTIONS = [
  { value: 'uploadWasTakingTooLong', text: 'Upload was taking too long' },
  {
    value: 'uploadFailed',
    text: 'Upload failed',
  },
  {
    value: 'photosWereNotNecessary',
    text: 'Photos were not necessary',
  },
  {
    value: 'other',
    text: 'Other',
  },
]

const ConfirmCloseWorkOrderWithoutPhotosForm = (props: Props) => {
  const { onSubmit } = props

  const {
    handleSubmit,
    register,
    errors,
    // setError,
    // clearErrors,
    watch,
    getValues,
    trigger,
  } = useForm({
    shouldUnregister: false,
  })

  const [error, setError] = useState<string | null>(null)

  return (
    <div className="close-work-order-confirmation-form">
      <form
        role="form"
        onSubmit={handleSubmit((data) => {
          console.log({ data })

          setError(null)

          if (
            (data.comments === null || data.comments.trim() === '') &&
            data.reason === null
          ) {
            setError('Please select an option, or add comments')
            return
          }

          onSubmit(data)
        })}
      >
        <div>
          <h2 className="lbh-heading-h2 " style={{ marginBottom: '45px' }}>
            You closed the work order without photos. Help us understand why.
          </h2>

          {error !== null && (
            <div>
              <ErrorMessage label={error} />
            </div>
          )}

          <Radio
            name="reason"
            label="Reason for not adding a photo"
            options={FORM_OPTIONS}
            register={register({
              required: 'Please select an option',
            })}
            error={errors.reason}
          />

          <TextArea
            name="comments"
            label="Comments"
            register={register({
              validate: (value) => {
                const reason = getValues('reason')

                if (
                  reason === 'other' &&
                  (value === null || value.trim() === '')
                ) {
                  return 'Please summarise why a photo cannot be uploaded'
                }

                return true
              },
            })}
            error={errors.comments}
          />

          <div>
            <PrimarySubmitButton label="Take me to my jobs" />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConfirmCloseWorkOrderWithoutPhotosForm

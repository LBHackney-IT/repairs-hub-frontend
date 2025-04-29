import { useState } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../../Errors/ErrorMessage'
import { Button, PrimarySubmitButton, Radio, TextArea } from '../../Form'

interface Props {
  onSubmit: (data: { [x: string]: any }) => void
  onSkip: () => void
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
  const { onSubmit, onSkip } = props

  const { handleSubmit, register, errors, getValues } = useForm({
    shouldUnregister: false,
  })

  const [error, setError] = useState<string | null>(null)

  return (
    <div className="close-work-order-confirmation-form">
      <form
        role="form"
        onSubmit={handleSubmit((data) => {
          setError(null)

          if (
            (data.comments === null || data.comments.trim() === '') &&
            data.reason === null
          ) {
            setError('Please select a reason, or add comments')
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
            labelSize="s"
            options={FORM_OPTIONS}
            register={register({
              required: 'Please select a reason',
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
                  return 'Please give a reason'
                }

                return true
              },
            })}
            error={errors.comments}
          />

          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '15px' }}>
              <PrimarySubmitButton
                id="submit-work-order-close-confirm-without-photos"
                label="Submit"
              />
            </div>

            <div className="govuk-form-group lbh-form-group">
              <Button
                isSecondary
                type="button"
                onClick={onSkip}
                label="Close"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConfirmCloseWorkOrderWithoutPhotosForm

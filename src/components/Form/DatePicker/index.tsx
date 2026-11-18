import { FieldError } from 'react-hook-form'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

interface Props {
  label?: string
  labelSize?: 's' | 'm' | 'l' | 'xl'
  hint?: string
  name: string
  error?: FieldError | { message?: string }
  type?: string
  register?: any
  required?: boolean
  [key: string]: any
}

const DatePicker = ({
  name,
  register,
  error,
  required = false,
  hint,
  label,
  labelSize = 'm',
  ...otherProps
}: Props) => {
  return (
    <div
      className={cx('govuk-form-group lbh-form-group', {
        'govuk-form-group--error': error,
      })}
    >
      <label
        className={`govuk-label lbh-label govuk-label--${labelSize}`}
        htmlFor={name}
      >
        {label} {required && <span className="govuk-required">*</span>}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="govuk-hint lbh-hint">
          {hint}
        </span>
      )}
      {error && <ErrorMessage label={error.message} />}
      <input
        id={name}
        className={cx(`govuk-input govuk-input--width-10`, {
          'govuk-input--error': error,
        })}
        data-testid={name}
        type="date"
        ref={register}
        name={name}
        {...otherProps}
      />
    </div>
  )
}
export default DatePicker

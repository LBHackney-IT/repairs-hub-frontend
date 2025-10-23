import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'
import { FieldError } from 'react-hook-form'

interface Props {
  label: string
  hint?: string | JSX.Element
  name: string
  value?: string
  rows?: number
  register?: any
  error?: FieldError | { message: string }
  required?: boolean
  showAsOptional?: boolean
  className?: string
  [key: string]: any
}

const TextArea = (props: Props) => {
  const {
    label,
    hint,
    name,
    value,
    rows = 4,
    register,
    error,
    required = false,
    showAsOptional = false,
    className,
    ...otherProps
  } = props

  return (
    <div
      id={`${name}-form-group`}
      className={cx('govuk-form-group lbh-form-group', {
        'govuk-form-group--error': Boolean(error),
      })}
    >
      {label && (
        <label className="govuk-label lbh-label" htmlFor={name}>
          {label}
          {required && <span className="govuk-required">*</span>}
          {showAsOptional && ' (optional)'}
        </label>
      )}
      {hint && (
        <span id={`${name}-hint`} className="govuk-hint lbh-hint">
          {hint}
        </span>
      )}
      {error && <ErrorMessage label={error.message} />}
      <textarea
        className={cx(
          'govuk-textarea lbh-textarea',
          {
            'govuk-textarea--error': Boolean(error),
          },
          className
        )}
        id={name}
        name={name}
        ref={register}
        data-testid={name}
        rows={rows}
        aria-describedby={`${name}-hint ${name}-error`}
        value={value}
        {...otherProps}
      />
    </div>
  )
}

export default TextArea

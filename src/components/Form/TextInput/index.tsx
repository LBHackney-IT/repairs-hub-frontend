import { FieldError } from 'react-hook-form'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

interface Props {
  label?: string
  hint?: string
  required?: boolean
  name: string
  error?: FieldError | { message?: string }
  type?: string
  register?: any
  widthClass?: string
  defaultValue?: string
  isLabelGreen?: boolean
  additionalDivClasses?: string
  onBlur?: any
  [key: string]: any
}

const TextInput = (props: Props) => {
  const {
    label,
    hint,
    name,
    register,
    error,
    type = 'text',
    widthClass = '',
    required,
    onBlur = '',
    defaultValue,
    additionalDivClasses = '',
    isLabelGreen = false,
    ...otherProps
  } = props

  return (
    <div
      id={`${name}-form-group`}
      className={cx(
        'govuk-form-group lbh-form-group',
        {
          'govuk-form-group--error': error,
        },
        additionalDivClasses
      )}
    >
      <label
        className="govuk-label lbh-label"
        htmlFor={name}
        {...(isLabelGreen && { style: { color: '#0CA789' } })}
      >
        {label} {required && <span className="govuk-required">*</span>}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="govuk-hintf lbh-hint">
          {hint}
        </span>
      )}
      {error && <ErrorMessage label={error.message} />}
      <input
        className={cx(`govuk-input lbh-input ${widthClass}`, {
          'govuk-input--error': error,
        })}
        id={name}
        name={name}
        data-testid={name}
        type={type}
        ref={register}
        aria-describedby={hint && `${name}-hint`}
        defaultValue={defaultValue}
        onBlur={(e) => onBlur && onBlur(e)}
        {...otherProps}
      />
    </div>
  )
}

export default TextInput

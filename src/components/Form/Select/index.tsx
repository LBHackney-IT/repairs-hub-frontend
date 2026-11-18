import { ReactNode, ChangeEvent } from 'react'
import { FieldError } from 'react-hook-form'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

type SelectOption = string | { value: string; text: string }

interface Props {
  label: string
  name: string
  options: SelectOption[]
  children?: ReactNode
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  isUnselectable?: boolean
  ignoreValue?: boolean
  defaultValue?: string
  value?: string
  error?: FieldError | { message?: string }
  disabled?: boolean
  register?: any
  widthClass?: string
  hint?: string
}

const Select = ({
  label,
  hint,
  name,
  options,
  onChange,
  children,
  isUnselectable = true,
  ignoreValue,
  defaultValue,
  value,
  error,
  disabled,
  register,
  widthClass,
  required,
}: Props) => (
  <div
    id={`${name}-form-group`}
    className={cx('govuk-form-group lbh-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <label className="govuk-label lbh-label" htmlFor={name}>
      {label} {required && <span className="govuk-required">*</span>}
    </label>
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint lbh-hint">
        {hint}
      </span>
    )}
    {children}
    {error && <ErrorMessage label={error.message} />}
    <select
      className={cx('govuk-select lbh-select', widthClass, {
        'govuk-select--error': error,
      })}
      id={name}
      name={name}
      data-testid={name}
      ref={register}
      aria-describedby={hint && `${name}-hint`}
      onChange={(e) => onChange && onChange(e)}
      value={ignoreValue ? undefined : value}
      disabled={disabled}
      defaultValue={defaultValue}
    >
      {isUnselectable && <option key="empty" value=""></option>}
      {options.map((option) => {
        const { value, text } =
          typeof option === 'string' ? { value: option, text: option } : option
        return (
          <option key={value} value={value}>
            {text}
          </option>
        )
      })}
    </select>
  </div>
)

export default Select

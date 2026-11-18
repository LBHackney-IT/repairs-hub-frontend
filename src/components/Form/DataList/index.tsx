import { useEffect } from 'react'
import { ReactNode, ChangeEvent } from 'react'
import { FieldError } from 'react-hook-form'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

interface Props {
  label: string
  name: string
  options: string[]
  hint?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  children?: ReactNode
  error?: FieldError | { message?: string }
  disabled?: boolean | string
  register?: any
  widthClass?: string
  required?: boolean
  labelMessage?: string
  value?: string
  defaultValue?: string
  additionalDivClasses?: string | string[]
  maxLength?: number
  remainingCharacterCount?: number
}

const DataList = ({
  options,
  label,
  hint,
  name,
  onChange,
  children,
  error,
  disabled,
  register,
  widthClass,
  required,
  labelMessage,
  value,
  defaultValue,
  additionalDivClasses,
  maxLength,
  remainingCharacterCount,
}: Props) => {
  useEffect(() => {
    if (!options || !Array.isArray(options)) {
      throw new Error('DataList requires an options[] prop')
    }
  }, [])

  return (
    <div
      id={`${name}-form-group`}
      className={cx(
        `govuk-form-group lbh-form-group`,
        {
          'govuk-form-group--error': error,
        },
        additionalDivClasses
      )}
    >
      <label
        className="govuk-label lbh-label"
        style={maxLength ? { fontSize: '1.1rem', fontWeight: 'normal' } : {}}
        htmlFor={name}
      >
        {label} {required && <span className="govuk-required">*</span>}{' '}
        {labelMessage && <span> {labelMessage}</span>}
      </label>
      {hint && (
        <span
          id={`${name}-hint`}
          className="govuk-hint lbh-hint"
          style={maxLength ? { fontSize: '1rem', margin: '0' } : {}}
        >
          {hint}
        </span>
      )}
      {children}
      {error && <ErrorMessage label={error.message} />}
      <input
        className={`govuk-select lbh-select ${widthClass}`}
        id={name}
        name={name}
        data-testid={name}
        ref={
          maxLength
            ? register({
                required: {
                  value: true,
                  message: `This field can't be empty`,
                },
                maxLength: {
                  value: maxLength,
                  message: 'You have exceeded the maximum amount of characters',
                },
                pattern: {
                  value: /^[A-Za-z\s:/]+$/i,
                  message: 'Invalid character entered',
                },
              })
            : register
        }
        aria-describedby={hint && `${name}-hint`}
        onChange={(e) => onChange && onChange(e)}
        disabled={disabled as boolean}
        aria-disabled={disabled as any}
        list={`autocomplete-list-${name}`}
        autoComplete="off"
        defaultValue={defaultValue}
        {...(value && { value })}
      />
      {maxLength ? (
        <span
          className="govuk-hint govuk-character-count__message"
          aria-live="polite"
        >
          You have {remainingCharacterCount} characters remaining.
        </span>
      ) : null}
      <datalist id={`autocomplete-list-${name}`}>
        {options.map((item, i) => (
          <option key={item + i} value={item} />
        ))}
      </datalist>
    </div>
  )
}

export default DataList

import { ChangeEventHandler, ReactNode } from 'react'
import cx from 'classnames'

import ErrorMessage from '../../../Errors/ErrorMessage'

interface RadioOption {
  value: string
  text: string
  defaultChecked?: boolean
  hint?: string
}

interface Props {
  label: string
  labelSize?: 's' | 'm' | 'l' | 'xl'
  hint?: string
  name: string
  selectedOption?: string | null
  options?: (string | RadioOption)[]
  register?: any
  error?: { message: string }
  children?: ReactNode
  required?: boolean
  isRadiosInline?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  [key: string]: any
}

const defaultOptions = ['Yes', 'No']

const ControlledRadio = ({
  label,
  labelSize = 'm',
  hint,
  name,
  selectedOption,
  options = defaultOptions,
  register,
  error,
  children,
  required,
  isRadiosInline = false,
  ...otherProps
}: Props) => (
  <div
    className={cx('govuk-form-group lbh-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <label className={`govuk-label govuk-label--${labelSize}`} htmlFor={name}>
      {label} {required && <span className="govuk-required">*</span>}
    </label>
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint lbh-hint">
        {hint}
      </span>
    )}
    {children}
    {error && <ErrorMessage label={error.message} />}
    <div
      className={cx('govuk-radios lbh-radios', {
        'govuk-radios--inline': isRadiosInline,
      })}
    >
      {options.map((option) => {
        const { value, text, defaultChecked, hint }: RadioOption =
          typeof option === 'string'
            ? { value: option, text: option, defaultChecked: false }
            : option
        return (
          <div className="govuk-radios__item" key={text}>
            <input
              className={cx('govuk-radios__input', {
                'govuk-input--error': error,
              })}
              id={`${name}_${value}`}
              name={name}
              type="radio"
              value={value}
              ref={register}
              data-testid={name}
              aria-describedby={
                hint &&
                `${name}-${value.replace(/\s+/g, '-').toLowerCase()}-hint`
              }
              defaultChecked={defaultChecked}
              // should only apply when parameter passed
              checked={selectedOption !== null && selectedOption === value}
              {...otherProps}
            />

            <label
              className="govuk-label lbh-label govuk-radios__label"
              htmlFor={`${name}_${value}`}
            >
              {text}
            </label>

            {hint && (
              <span
                id={`${name}-${value.replace(/\s+/g, '-').toLowerCase()}-hint`}
                className="govuk-hint govuk-radios__hint"
              >
                {hint}
              </span>
            )}
          </div>
        )
      })}
    </div>
  </div>
)

export default ControlledRadio

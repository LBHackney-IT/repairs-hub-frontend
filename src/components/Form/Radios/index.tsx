import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'
import { Fragment } from 'react'
import { FieldError } from 'react-hook-form'
import { JSX } from 'react'

const defaultOptions = ['Yes', 'No']

interface Props {
  label?: string
  labelSize?: 's' | 'm' | 'l' | 'xl'
  showAsOptional?: boolean
  hint?: string
  name: string
  options?:
    | string[]
    | {
        text: string
        value: string | boolean
        defaultChecked?: boolean
        hint?: string
        children?: JSX.Element
      }[]
  register?: any
  error?: FieldError | { message: string }
  children?: JSX.Element
  required?: boolean
  isRadiosInline?: boolean
  isGrid?: boolean
  [key: string]: any
}

const Radio = (props: Props) => {
  const {
    label,
    labelSize = 'm',
    showAsOptional = false,
    hint,
    name,
    options = defaultOptions,
    register,
    error,
    children,
    required,
    isRadiosInline = false,
    isGrid,
    hasWhiteBackground,
    ...otherProps
  } = props

  return (
    <div
      className={cx('govuk-form-group lbh-form-group', {
        'govuk-form-group--error': error,
      })}
    >
      <legend
        className={`govuk-fieldset__legend govuk-fieldset__legend--${labelSize}`}
      >
        {label} {showAsOptional && '(optional) '}
        {required && <span className="govuk-required">*</span>}
      </legend>
      <span id={`${name}-hint`} className="govuk-hint lbh-hint">
        {hint}
      </span>

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
        style={
          isGrid && {
            display: 'inline-grid',
            gridTemplateColumns: '1fr 1fr',
          }
        }
      >
        {options.map((option) => {
          const { value, text, defaultChecked, hint } =
            typeof option === 'string'
              ? {
                  value: option,
                  text: option,
                  hint: null,
                  defaultChecked: false,
                }
              : option
          return (
            <Fragment key={text}>
              <div className="govuk-radios__item">
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
                  {...otherProps}
                />

                <label
                  className={cx(
                    'govuk-label',
                    'lbh-label',
                    'govuk-radios__label',
                    hasWhiteBackground && 'white-background'
                  )}
                  htmlFor={`${name}_${value}`}
                >
                  {text}
                </label>

                {hint && (
                  <span
                    id={`${name}-${value
                      .replace(/\s+/g, '-')
                      .toLowerCase()}-hint`}
                    className="govuk-hint govuk-radios__hint"
                  >
                    {hint}
                  </span>
                )}
              </div>

              {option.children != null && (
                <div
                  className="govuk-radios__conditional"
                  id="conditional-contact"
                >
                  {option.children}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Radio

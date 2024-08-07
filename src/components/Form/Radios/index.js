import cx from 'classnames'
import PropTypes from 'prop-types'

import ErrorMessage from '../../Errors/ErrorMessage'
import { Fragment } from 'react'

const defaultOptions = ['Yes', 'No']

const Radio = ({
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
  ...otherProps
}) => (
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
    >
      {options.map((option) => {
        const { value, text, defaultChecked, hint } =
          typeof option === 'string'
            ? {
                value: option,
                text: option,
                defaultChecked: false,
                children: null,
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
                className="govuk-label lbh-label govuk-radios__label"
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

Radio.propTypes = {
  label: PropTypes.string.isRequired,
  labelSize: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  options: PropTypes.array,
  hint: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
}

export default Radio

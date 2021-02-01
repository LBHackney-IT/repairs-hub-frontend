import cx from 'classnames'
import PropTypes from 'prop-types'

import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'

const defaultOptions = ['Yes', 'No']

const Radio = ({
  label,
  labelSize = 'm',
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
    className={cx('govuk-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <label className={`govuk-label govuk-label--${labelSize}`} htmlFor={name}>
      {label} {required && <span className="govuk-required">*</span>}
    </label>
    <br />
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint">
        {hint}
      </span>
    )}
    {children}
    {error && <ErrorMessage label={error.message} />}
    <div
      className={cx('govuk-radios', { 'govuk-radios--inline': isRadiosInline })}
    >
      {options.map((option) => {
        const { value, text } =
          typeof option === 'string' ? { value: option, text: option } : option
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
              aria-describedby={hint && `${name}-hint`}
              {...otherProps}
            />
            <label
              className="govuk-label govuk-radios__label"
              htmlFor={`${name}_${value}`}
            >
              {text}
            </label>
          </div>
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

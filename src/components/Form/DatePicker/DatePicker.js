import PropTypes from 'prop-types'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'

const DatePicker = ({
  name,
  register,
  error,
  required,
  hint,
  label,
  labelSize = 'm',
  ...otherProps
}) => {
  return (
    <div
      className={cx('govuk-form-group', {
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
        <span id={`${name}-hint`} className="govuk-hint">
          {hint}
        </span>
      )}
      {error && <ErrorMessage label={error.message} />}
      <input
        id={name}
        className={cx(`govuk-input govuk-input--width-10`, {
          'govuk-input--error': error,
        })}
        type="date"
        ref={register}
        name={name}
        {...otherProps}
      />
    </div>
  )
}

DatePicker.propTypes = {
  label: PropTypes.string,
  labelSize: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  hint: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  type: PropTypes.string,
  register: PropTypes.func,
  required: PropTypes.bool,
}
export default DatePicker

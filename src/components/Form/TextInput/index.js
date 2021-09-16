import PropTypes from 'prop-types'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

const TextInput = ({
  label,
  hint,
  name,
  register,
  error,
  type = 'text',
  widthClass,
  required,
  onBlur,
  defaultValue,
  ...otherProps
}) => (
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
    {error && <ErrorMessage label={error.message} />}
    <input
      className={cx(`govuk-input lbh-input ${widthClass}`, {
        'govuk-input--error': error,
      })}
      id={name}
      name={name}
      type={type}
      ref={register}
      aria-describedby={hint && `${name}-hint`}
      defaultValue={defaultValue}
      onBlur={(e) => onBlur && onBlur(e)}
      {...otherProps}
    />
  </div>
)

TextInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
  type: PropTypes.string,
  register: PropTypes.func,
  widthClass: PropTypes.string,
}

export default TextInput

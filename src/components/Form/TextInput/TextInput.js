import PropTypes from 'prop-types'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'

const TextInput = ({
  label,
  hint,
  name,
  register,
  error,
  type = 'text',
  widthClass,
  ...otherProps
}) => (
  <div
    id={`${name}-form-group`}
    className={cx('govuk-form-group', {
      'govuk-form-group--error': error,
    })}
  >
    <label className="govuk-label" htmlFor={name}>
      {label}
    </label>
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint">
        {hint}
      </span>
    )}
    {error && <ErrorMessage label={error.message} />}
    <input
      className={cx(`govuk-input ${widthClass}`, {
        'govuk-input--error': error,
      })}
      id={name}
      name={name}
      type={type}
      ref={register}
      aria-describedby={hint && `${name}-hint`}
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

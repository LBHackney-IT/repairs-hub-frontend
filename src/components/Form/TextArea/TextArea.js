import PropTypes from 'prop-types'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'

const TextArea = ({
  label,
  hint,
  name,
  value,
  type,
  rows = 4,
  register,
  error,
  ...otherProps
}) => (
  <div
    id={`${name}-form-group`}
    className={cx('govuk-form-group', {
      'govuk-form-group--error': Boolean(error),
    })}
  >
    {label && (
      <label className="govuk-label" htmlFor={name}>
        {label}
      </label>
    )}
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint">
        {hint}
      </span>
    )}
    {error && <ErrorMessage label={error.message} />}
    <textarea
      className={cx('govuk-textarea', {
        'govuk-textarea--error': Boolean(error),
      })}
      id={name}
      name={name}
      type={type}
      ref={register}
      rows={rows}
      aria-describedby={`${name}-hint ${name}-error`}
      value={value}
      {...otherProps}
    />
  </div>
)

TextArea.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default TextArea

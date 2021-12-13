import PropTypes from 'prop-types'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

const TextArea = ({
  label,
  hint,
  name,
  value,
  type,
  rows = 4,
  register,
  error,
  required,
  className,
  ...otherProps
}) => (
  <div
    id={`${name}-form-group`}
    className={cx('govuk-form-group lbh-form-group', {
      'govuk-form-group--error': Boolean(error),
    })}
  >
    {label && (
      <label className="govuk-label lbh-label" htmlFor={name}>
        {label} {required && <span className="govuk-required">*</span>}
      </label>
    )}
    {hint && (
      <span id={`${name}-hint`} className="govuk-hint lbh-hint">
        {hint}
      </span>
    )}
    {error && <ErrorMessage label={error.message} />}
    <textarea
      className={cx(
        'govuk-textarea lbh-textarea',
        {
          'govuk-textarea--error': Boolean(error),
        },
        className
      )}
      id={name}
      name={name}
      type={type}
      ref={register}
      data-testid={name}
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

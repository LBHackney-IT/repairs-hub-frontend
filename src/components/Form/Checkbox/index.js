import cx from 'classnames'
import PropTypes from 'prop-types'

const Checkbox = ({
  label,
  name,
  register,
  error,
  checked,
  className,
  hidden,
  labelClassName,
}) => (
  <div
    className={cx(`govuk-checkboxes__item ${className}`, {
      'govuk-!-display-none': hidden,
    })}
  >
    <input
      className={cx('govuk-checkboxes__input', {
        'govuk-input--error': error,
      })}
      id={name}
      name={name}
      type="checkbox"
      ref={register}
      {...(checked && { defaultChecked: checked })}
    />
    <label
      className={cx('govuk-label govuk-checkboxes__label', labelClassName)}
      htmlFor={name}
    >
      {label}
    </label>
  </div>
)

Checkbox.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
  labelClassName: PropTypes.string,
}

export default Checkbox

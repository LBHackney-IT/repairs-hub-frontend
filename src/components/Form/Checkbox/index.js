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
  hintText,
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
      data-testid={name}
      {...(checked && { defaultChecked: checked })}
    />
    <label
      className={cx('govuk-label govuk-checkboxes__label', labelClassName)}
      htmlFor={name}
    >
      {label}
    </label>
    {hintText && (
      <span
        id="government-gateway-item-hint"
        class="govuk-hint govuk-checkboxes__hint lbh-hint"
      >
        {hintText}
      </span>
    )}
  </div>
)

Checkbox.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
  labelClassName: PropTypes.string,
  hintText: PropTypes.string,
}

export default Checkbox

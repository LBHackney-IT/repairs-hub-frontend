import cx from 'classnames'
import PropTypes from 'prop-types'

const CheckboxSmall = ({
  label,
  name,
  register,
  error,
  checked,
  className,
  hidden,
  labelClassName,
  hintText,
  children,
  showChildren,
  size = 'LARGE',
  ...otherProps
}) => (
  <div
    className="govuk-checkboxes--small"
    style={{
      overflow: 'auto',
      paddingLeft: '10px',
    }}
  >
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
        {...otherProps}
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
          className="govuk-hint govuk-checkboxes__hint lbh-hint"
        >
          {hintText}
        </span>
      )}

      {children !== null && children !== undefined && showChildren && (
        <div
          style={{
            marginLeft: '18px',
            paddingLeft: '33px',
            borderLeft: `4px solid ${error ? '#be3a34' : '#b1b4b6'}`,
          }}
        >
          {children}
        </div>
      )}
    </div>
  </div>
)

CheckboxSmall.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  error: PropTypes.shape({ message: PropTypes.string.isRequired }),
  labelClassName: PropTypes.string,
  hintText: PropTypes.string,
}

export default CheckboxSmall

import PropTypes from 'prop-types'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage/ErrorMessage'

const Select = ({
  label,
  hint,
  name,
  options,
  onChange,
  children,
  isUnselectable = true,
  ignoreValue,
  defaultValue,
  value,
  error,
  disabled,
  register,
  widthClass,
  required,
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
    {children}
    {error && <ErrorMessage label={error.message} />}
    <select
      className={`govuk-select lbh-select ${widthClass}`}
      id={name}
      name={name}
      data-testid={name}
      ref={register}
      aria-describedby={hint && `${name}-hint`}
      onChange={(e) => onChange && onChange(e)}
      value={ignoreValue ? undefined : value}
      disabled={disabled}
      defaultValue={defaultValue}
    >
      {isUnselectable && <option key="empty" value=""></option>}
      {options.map((option, i) => {
        const { value, text } =
          typeof option === 'string' ? { value: option, text: option } : option
        return (
          <option key={value + i} value={value}>
            {text}
          </option>
        )
      })}
    </select>
  </div>
)

Select.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  selected: PropTypes.string,
  children: PropTypes.node,
}

export default Select

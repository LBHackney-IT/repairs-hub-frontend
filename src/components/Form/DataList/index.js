import PropTypes from 'prop-types'
import { useEffect } from 'react'
import cx from 'classnames'
import ErrorMessage from '../../Errors/ErrorMessage'

const DataList = ({
  options,
  label,
  hint,
  name,
  onChange,
  children,
  error,
  disabled,
  register,
  widthClass,
  required,
  labelMessage,
  value,
  defaultValue,
  additionalDivClasses,
}) => {
  useEffect(() => {
    if (!options || !Array.isArray(options)) {
      throw new Error('DataList requires an options[] prop')
    }
  }, [])

  return (
    <div
      id={`${name}-form-group`}
      className={cx(
        `govuk-form-group lbh-form-group`,
        {
          'govuk-form-group--error': error,
        },
        additionalDivClasses
      )}
    >
      <label className="govuk-label lbh-label" htmlFor={name}>
        {label} {required && <span className="govuk-required">*</span>}{' '}
        {labelMessage && <span> {labelMessage}</span>}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="govuk-hint lbh-hint">
          {hint}
        </span>
      )}
      {children}
      {error && <ErrorMessage label={error.message} />}
      <input
        className={`govuk-select lbh-select ${widthClass}`}
        id={name}
        name={name}
        data-testid={name}
        ref={register}
        aria-describedby={hint && `${name}-hint`}
        onChange={(e) => onChange && onChange(e)}
        disabled={disabled}
        aria-disabled={disabled}
        list={`autocomplete-list-${name}`}
        autoComplete="off"
        defaultValue={defaultValue}
        {...(value && { value })}
      />

      <datalist id={`autocomplete-list-${name}`}>
        {options.map((item, i) => (
          <option key={item + i} value={item} />
        ))}
      </datalist>
    </div>
  )
}

DataList.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  children: PropTypes.node,
  labelMessage: PropTypes.string,
}

export default DataList

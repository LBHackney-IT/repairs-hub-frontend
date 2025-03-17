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
  maxLength,
  remainingCharacterCount,
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
      <label
        className="govuk-label lbh-label"
        style={maxLength ? { fontSize: '1.1rem', fontWeight: 'normal' } : {}}
        htmlFor={name}
      >
        {label} {required && <span className="govuk-required">*</span>}{' '}
        {labelMessage && <span> {labelMessage}</span>}
      </label>
      {hint && (
        <span
          id={`${name}-hint`}
          className="govuk-hint lbh-hint"
          style={maxLength ? { fontSize: '1rem', margin: '0' } : {}}
        >
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
        ref={
          maxLength
            ? register({
                required: {
                  value: true,
                  message: `This field can't be empty`,
                },
                maxLength: {
                  value: maxLength,
                  message: 'You have exceeded the maximum amount of characters',
                },
                pattern: {
                  value: /^[A-Za-z\s:\/]+$/i,
                  message: 'Only alphabetical characters are allowed',
                },
              })
            : register
        }
        aria-describedby={hint && `${name}-hint`}
        onChange={(e) => onChange && onChange(e)}
        disabled={disabled}
        aria-disabled={disabled}
        list={`autocomplete-list-${name}`}
        autoComplete="off"
        defaultValue={defaultValue}
        {...(value && { value })}
      />
      {maxLength ? (
        <span
          className="govuk-hint govuk-character-count__message"
          aria-live="polite"
        >
          You have {remainingCharacterCount} characters remaining.
        </span>
      ) : null}
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

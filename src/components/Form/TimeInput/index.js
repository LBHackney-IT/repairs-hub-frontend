import { useState, useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Controller } from 'react-hook-form'
import ErrorMessage from '../../Errors/ErrorMessage'

const getInitialTime = (value) => {
  const time = value?.split(':') || ['', '']

  return { hour: time[0], minutes: time[1], seconds: '00' }
}

const TimeInput = forwardRef(
  (
    {
      label,
      labelSize = 's',
      error,
      hint,
      value,
      name,
      defaultValue,
      register,
      onChange,
      required,
      showAsOptional = false,
      ...otherProps
    },
    ref
  ) => {
    const [time, setTime] = useState(
      getInitialTime(value ? value : defaultValue)
    )

    useEffect(() => {
      const { hour, minutes, seconds } = time
      hour !== '' &&
        minutes !== '' &&
        seconds !== '' &&
        onChange(`${hour}:${minutes}:${seconds}`)
      hour === '' && minutes === '' && seconds === '' && onChange()
    }, [time])
    return (
      <div
        className={cx('govuk-form-group lbh-form-group', {
          'govuk-form-group--error': error,
        })}
      >
        <fieldset
          className="govuk-fieldset lbh-fieldset"
          role="group"
          aria-describedby={`${name}-hint`}
        >
          <legend
            className={`govuk-fieldset__legend govuk-fieldset__legend--${labelSize}`}
          >
            {label} {showAsOptional && '(optional)'}{' '}
            {required && <span className="govuk-required">*</span>}
          </legend>
          <span id={`${name}-hint`} className="govuk-hint lbh-hint">
            {hint}
          </span>
          {error && <ErrorMessage label={error.message} />}
          <div className="govuk-date-input lbh-date-input" id={name}>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  className="govuk-label lbh-label govuk-date-input__label"
                  htmlFor={`${name}-hour`}
                >
                  Hour
                </label>
                <input
                  className={cx(
                    'govuk-input lbh-input govuk-date-input__input govuk-input--width-2',
                    {
                      'govuk-input--error': error,
                    }
                  )}
                  id={`${name}-hour`}
                  name={`${name}-hour`}
                  data-testid={`${name}-hour`}
                  type="text"
                  ref={register}
                  pattern="^\d{1,2}$"
                  inputMode="numeric"
                  defaultValue={time.hour}
                  onChange={({ target: { value } }) =>
                    setTime({ ...time, hour: value })
                  }
                  ref={ref}
                  {...otherProps}
                />
              </div>
            </div>
            <div className="govuk-date-input__item">
              <div className="govuk-form-group">
                <label
                  className="govuk-label lbh-label govuk-date-input__label"
                  htmlFor={`${name}-minutes`}
                >
                  Minutes
                </label>
                <input
                  className={cx(
                    'govuk-input govuk-date-input__input govuk-input--width-2',
                    {
                      'govuk-input--error': error,
                    }
                  )}
                  id={`${name}-minutes`}
                  name={`${name}-minutes`}
                  data-testid={`${name}-minutes`}
                  type="text"
                  ref={register}
                  pattern="^\d{1,2}$"
                  inputMode="numeric"
                  defaultValue={time.minutes}
                  onChange={({ target: { value } }) =>
                    setTime({ ...time, minutes: value })
                  }
                  {...otherProps}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    )
  }
)

TimeInput.propTypes = {
  label: PropTypes.string,
  labelSize: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
  hint: PropTypes.string,
  rules: PropTypes.shape({}),
  showAsOptional: PropTypes.bool,
}

const ControlledTimeInput = ({
  control,
  name,
  label,
  required,
  showAsOptional = false,
  ...otherProps
}) => {
  return (
    <Controller
      as={
        <TimeInput
          label={label}
          showAsOptional={showAsOptional}
          {...otherProps}
        />
      }
      onChange={([value]) => value}
      rules={{
        validate: {
          valid: (value) => {
            // required - validate being empty
            if (required && !value)
              return `Please enter a value for ${label.toLowerCase()}`

            // not required - valid if empty
            if (!required && !value) return true

            const hourStr = value.split(':')[0] || ''
            const minuteStr = value.split(':')[1] || ''

            const hour = parseInt(hourStr)
            const minute = parseInt(minuteStr)

            if (isNaN(hour) || isNaN(minute)) return 'Please enter a valid time'

            if (
              hourStr.length == 2 &&
              minuteStr.length == 2 &&
              hour >= 0 &&
              hour < 24 &&
              minute >= 0 &&
              minute < 60
            ) {
              return true
            }

            return 'Please enter a valid time'
          },
        },
      }}
      name={name}
      control={control}
      defaultValue={control.defaultValuesRef.current[name] || null}
    />
  )
}

ControlledTimeInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.shape({}),
  control: PropTypes.object.isRequired,
  required: PropTypes.bool.isRequired,
  showAsOptional: PropTypes.bool,
}

export default ControlledTimeInput

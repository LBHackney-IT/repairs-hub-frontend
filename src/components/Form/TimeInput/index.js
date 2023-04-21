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
            {label} {required && <span className="govuk-required">*</span>}
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
}

const ControlledTimeInput = ({ control, name, rules, optional, ...otherProps }) => (
  <Controller
    as={<TimeInput {...otherProps} />}
    onChange={([value]) => value}
    name={name}
    rules={{
      ...rules,
      validate: {
        valid: (value) => {

          // if optional, only validate when not empty
          if (optional && !value) return true

          if (value) {
            let hourStr = value.split(':')[0]
            let minuteStr = value.split(':')[1]
            let hour = parseInt(hourStr)
            let minute = parseInt(minuteStr)
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
          }
          return 'Please enter a valid time'
        },
        ...rules?.validate,
      },
    }}
    control={control}
    defaultValue={control.defaultValuesRef.current[name] || null}
  />
)

ControlledTimeInput.propTypes = {
  name: PropTypes.string.isRequired,
  rules: PropTypes.shape({}),
  control: PropTypes.object.isRequired,
}

export default ControlledTimeInput

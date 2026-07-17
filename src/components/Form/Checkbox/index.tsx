import cx from 'classnames'
import { JSX } from 'react'

interface Props {
  label: string | JSX.Element
  name: string
  register: any
  error: string | null

  hintText?: string
  labelClassName?: string
  checked?: boolean
  className?: string
  hidden?: boolean
  hasWhiteBackground?: boolean
  children?: JSX.Element
  showChildren?: boolean
}

const Checkbox = (props: Props) => {
  const {
    label,
    name,
    register,
    error,
    checked,
    className,
    hidden,
    labelClassName,
    hintText,
    hasWhiteBackground,
    children,
    showChildren,
  } = props

  return (
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
        className={cx(
          'govuk-label govuk-checkboxes__label',
          hasWhiteBackground && 'white-background',
          labelClassName
        )}
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
  )
}

export default Checkbox

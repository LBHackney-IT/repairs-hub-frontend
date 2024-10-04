import cx from 'classnames'

interface Props {
  onClick: () => void
  label: string
  type: 'submit' | 'reset' | 'button'
  isSecondary?: boolean
  className?: string
  [x: string]: any
}

const Button = (props: Props) => {
  const { onClick, label, type, isSecondary, className, ...otherProps } = props

  return (
    <button
      className={cx(
        'govuk-button lbh-button',
        {
          'govuk-button-secondary lbh-button--secondary': isSecondary,
        },
        className
      )}
      data-module="govuk-button"
      onClick={onClick}
      type={type}
      {...otherProps}
    >
      {label}
    </button>
  )
}

export default Button

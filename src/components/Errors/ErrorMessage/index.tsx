import cx from 'classnames'

interface Props {
  label: string
  className?: string
  id?: number
}

const ErrorMessage = ({ label, className, id }: Props) => (
  <span
    data-error-id={cx(id >= 0 ? `error-${id}` : null)}
    className={cx('govuk-error-message lbh-error-message', className)}
    data-testid="error-message"
  >
    <span className="govuk-visually-hidden">Error:</span> {label}
  </span>
)

export default ErrorMessage

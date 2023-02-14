import PropTypes from 'prop-types'
import cx from 'classnames'

const ErrorMessage = ({ label, className, id }) => (
  <span
    data-error-id={cx(id >= 0 ? `error-${id}` : null)}
    className={cx('govuk-error-message lbh-error-message', className)}
    data-testid="error-message"
  >
    <span className="govuk-visually-hidden">Error:</span> {label}
  </span>
)

ErrorMessage.propTypes = {
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default ErrorMessage

import PropTypes from 'prop-types'

const ErrorMessage = ({ label }) => (
  <span className="govuk-error-message">
    <span className="govuk-visually-hidden">Error:</span> {label}
  </span>
)

ErrorMessage.propTypes = {
  label: PropTypes.node.isRequired
}

export default ErrorMessage

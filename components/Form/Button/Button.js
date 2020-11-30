import PropTypes from 'prop-types'

const Button = ({ onClick, label, type, ...otherProps }) => (
  <div className="govuk-form-group">
    <button
      className="govuk-button"
      data-module="govuk-button"
      onClick={onClick}
      type={type}
      {...otherProps}
    >
      {label}
    </button>
  </div>
)

Button.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.node.isRequired,
  type: PropTypes.string
}

export default Button

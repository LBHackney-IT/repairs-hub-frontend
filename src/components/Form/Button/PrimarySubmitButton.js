import PropTypes from 'prop-types'
import Button from '.'

// Primary submit buttons have their own <div>
// to separate them from the rest of the form
const PrimarySubmitButton = ({ ...otherProps }) => (
  <div className="govuk-form-group lbh-form-group">
    <Button type="submit" {...otherProps}></Button>
  </div>
)

PrimarySubmitButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.node.isRequired,
  type: PropTypes.string,
  isSecondary: PropTypes.bool,
  className: PropTypes.string,
}

export default PrimarySubmitButton

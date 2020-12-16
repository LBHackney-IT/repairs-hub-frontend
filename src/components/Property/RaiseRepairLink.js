import PropTypes from 'prop-types'

const RaiseRepairLink = ({ description }) => (
  <span className="govuk-heading-m text-green">
    <strong>Raise a repair on this {description.toLowerCase()}</strong>
  </span>
)

RaiseRepairLink.propTypes = {
  description: PropTypes.string.isRequired,
}

export default RaiseRepairLink

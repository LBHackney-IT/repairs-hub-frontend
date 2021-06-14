import PropTypes from 'prop-types'

const Status = ({ status }) => (
  <>
    <span
      className={`govuk-tag lbh-tag lbh-tag--status-${status
        .replace(/\s+/g, '-')
        .toLowerCase()}`}
    >
      {status}
    </span>
  </>
)

Status.propTypes = {
  status: PropTypes.string.isRequired,
}

export default Status

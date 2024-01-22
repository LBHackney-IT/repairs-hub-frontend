import PropTypes from 'prop-types'
import cx from 'classnames'

const DampAndMouldStatus = ({ children, variant }) => (
  <span
    className={cx([
      `govuk-tag lbh-tag bh-body-xs damp-and-mould-status `,
      `lbh-tag--status-${variant}`,
    ])}
  >
    {children}
  </span>
)

DampAndMouldStatus.propTypes = {
  text: PropTypes.string.isRequired,
}

export default DampAndMouldStatus

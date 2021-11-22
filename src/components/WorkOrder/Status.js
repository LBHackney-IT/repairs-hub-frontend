import PropTypes from 'prop-types'
import cx from 'classnames'

const Status = ({ text, className }) => (
  <>
    <span
      className={cx(
        `govuk-tag lbh-tag lbh-tag--status-${text
          .replace(/\s+/g, '-')
          .toLowerCase()}`,
        className
      )}
    >
      {text}
    </span>
  </>
)

Status.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Status

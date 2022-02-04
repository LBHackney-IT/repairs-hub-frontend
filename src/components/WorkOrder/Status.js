import PropTypes from 'prop-types'
import cx from 'classnames'
import { convertToSentenceCases } from '@/utils/helpers/textConverter'

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
      {convertToSentenceCases(text)}
    </span>
  </>
)

Status.propTypes = {
  text: PropTypes.string.isRequired,
}

export default Status

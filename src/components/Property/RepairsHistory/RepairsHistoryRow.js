import PropTypes from 'prop-types'
import Link from 'next/link'
import { dateToStr } from '../../../utils/date'
import { extractTimeFromDate } from '../../../utils/time'

const RepairsHistoryRow = ({ reference, dateRaised, description, status }) => (
  <tr
    className="govuk-table__row govuk-table__row--clickable govuk-body-s"
    data-ref={reference}
  >
    <td className="govuk-table__cell">
      <Link href={`/work-orders/${reference}`}>
        <a>{reference}</a>
      </Link>
    </td>
    <td className="govuk-table__cell">
      {dateRaised ? dateToStr(dateRaised) : '—'}
      <div className="work-order-hours">
        {dateRaised ? extractTimeFromDate(dateRaised) : ''}
      </div>
    </td>
    <td className="govuk-table__cell">
      <span
        className={`status status-${status.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {status}
      </span>
    </td>
    <td className="govuk-table__cell description">{description}</td>
  </tr>
)

RepairsHistoryRow.propTypes = {
  reference: PropTypes.number.isRequired,
  dateRaised: PropTypes.instanceOf(Date),
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default RepairsHistoryRow

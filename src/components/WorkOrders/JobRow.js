import PropTypes from 'prop-types'
import { dateToStr } from '../../utils/date'
import { extractTimeFromDate } from '../../utils/time'
import Link from 'next/link'

const JobRow = ({
  reference,
  dateRaised,
  priority,
  property,
  status,
  tradeDescription,
  description,
}) => (
  <tr
    className="govuk-table__row govuk-table__row--clickable govuk-body-s hackney-work-order-table"
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
    <td className="govuk-table__cell">{priority}</td>
    <td className="govuk-table__cell">{property}</td>
    <td className="govuk-table__cell">{status}</td>
    <td className="govuk-table__cell">{tradeDescription}</td>
    <td className="govuk-table__cell">
      <p className="description">{description}</p>
    </td>
  </tr>
)

JobRow.propTypes = {
  reference: PropTypes.number.isRequired,
  dateRaised: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tradeDescription: PropTypes.string.isRequired,
}

export default JobRow

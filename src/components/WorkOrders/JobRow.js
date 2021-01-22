import PropTypes from 'prop-types'
import { dateToStr } from '../../utils/date'
import { extractTimeFromDate } from '../../utils/time'
import Link from 'next/link'

const JobRow = ({
  reference,
  dateRaised,
  lastUpdated,
  priority,
  property,
  status,
  description,
}) => (
  <tr className="govuk-table__row govuk-table__row--clickable govuk-body-s hackney-work-order-table">
    <td className="govuk-table__cell">{reference}</td>
    <td className="govuk-table__cell">
      {dateRaised ? dateToStr(dateRaised) : '—'}
      <div className="work-order-hours">
        {dateRaised ? extractTimeFromDate(dateRaised) : ''}
      </div>
    </td>
    <td className="govuk-table__cell">
      {lastUpdated ? dateToStr(lastUpdated) : '—'}
      <div className="work-order-hours">
        {lastUpdated ? extractTimeFromDate(lastUpdated) : ''}
      </div>
    </td>
    <td className="govuk-table__cell">{priority}</td>
    <td className="govuk-table__cell">{property}</td>
    <td className="govuk-table__cell">{status}</td>
    <td className="govuk-table__cell">
      <p className="description">{description}</p>
    </td>
    <td className="govuk-table__cell">
      <Link href={`/repairs/jobs/${reference}/choose-option`}>
        <a>Update</a>
      </Link>
    </td>
  </tr>
)

JobRow.propTypes = {
  reference: PropTypes.number.isRequired,
  dateRaised: PropTypes.instanceOf(Date),
  lastUpdated: PropTypes.instanceOf(Date),
  priority: PropTypes.string,
  property: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default JobRow

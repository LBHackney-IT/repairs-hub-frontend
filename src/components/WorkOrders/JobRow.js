import PropTypes from 'prop-types'
import Link from 'next/link'
import { dateToStr } from '../../utils/date'
import { extractTimeFromDate } from '../../utils/time'

const JobRow = ({
  reference,
  dateRaised,
  lastUpdated,
  priority,
  property,
  description,
}) => (
  <tr className="govuk-table__row govuk-body-s govuk-table__row--clickable">
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
    <td className="govuk-table__cell">
      {property} 123 Harrison street, Postcode: W1E EF
    </td>
    <td className="govuk-table__cell">
      <p className="description">{description}</p>
    </td>
    <td className="govuk-table__cell">
      <Link href={`/repairs/jobs/${reference}/select-process`}>
        <a>Update</a>
      </Link>
    </td>
  </tr>
)

JobRow.propTypes = {
  reference: PropTypes.string.isRequired,
  dateRaised: PropTypes.instanceOf(Date),
  lastUpdated: PropTypes.instanceOf(Date),
  priority: PropTypes.string,
  property: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default JobRow

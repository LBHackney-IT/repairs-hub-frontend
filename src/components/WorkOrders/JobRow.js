import PropTypes from 'prop-types'

const dateToStr = (date) =>
  date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const extractTimeFromDate = (date) =>
  date.toLocaleString('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

const JobRow = ({
  reference,
  dateRaised,
  lastUpdated,
  priority,
  property,
  description,
}) => (
  <tr className="govuk-table__row govuk-table__row--clickable govuk-body-s">
    <td className="govuk-table__cell">{reference}</td>
    <td className="govuk-table__cell">
      {dateRaised ? dateToStr(dateRaised) : '—'}
      <div className="work-order-hours">
        {dateRaised ? extractTimeFromDate(dateRaised) : ''}
      </div>
    </td>
    <td className="govuk-table__cell">
      {lastUpdated ? dateToStr(lastUpdated) : '—'}
    </td>
    <td className="govuk-table__cell">{priority}</td>
    <td className="govuk-table__cell">{property}</td>
    <td className="govuk-table__cell">{description}</td>
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

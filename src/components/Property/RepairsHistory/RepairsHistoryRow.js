import { useContext } from 'react'
import PropTypes from 'prop-types'
import UserContext from '../../UserContext/UserContext'
import { dateToStr } from '../../../utils/date'
import { extractTimeFromDate } from '../../../utils/time'

const RepairsHistoryRow = ({
  reference,
  dateRaised,
  tradeDescription,
  description,
  status,
}) => {
  const { user } = useContext(UserContext)

  return (
    <tr
      className="govuk-table__row govuk-table__row--clickable govuk-body-s"
      data-ref={reference}
    >
      {user && user.hasAgentPermissions && (
        <td className="govuk-table__cell">
          <a href={`/work-orders/${reference}`}>{reference}</a>
        </td>
      )}
      <td className="govuk-table__cell">
        {dateRaised ? dateToStr(dateRaised) : '—'}
        <div className="work-order-hours">
          {dateRaised ? extractTimeFromDate(dateRaised) : ''}
        </div>
      </td>
      <td className="govuk-table__cell">{tradeDescription}</td>
      <td className="govuk-table__cell">
        <span
          className={`status status-${status
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
        >
          {status}
        </span>
      </td>
      <td className="govuk-table__cell description">{description}</td>
    </tr>
  )
}

RepairsHistoryRow.propTypes = {
  reference: PropTypes.number.isRequired,
  dateRaised: PropTypes.instanceOf(Date),
  tradeDescription: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default RepairsHistoryRow

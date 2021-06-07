import { useContext } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import UserContext from '../../UserContext/UserContext'
import { dateToStr } from '../../../utils/date'
import { extractTimeFromDate } from '../../../utils/time'
import { TR, TD } from '../../Layout/Table'

const RepairsHistoryRow = ({
  reference,
  dateRaised,
  tradeDescription,
  description,
  status,
}) => {
  const { user } = useContext(UserContext)

  return (
    <TR
      reference={reference}
      className="govuk-table__row--clickable lbh-body-s"
    >
      {user &&
        (user.hasAgentPermissions ||
          user.hasContractManagerPermissions ||
          user.hasAuthorisationManagerPermissions) && (
          <TD>
            <Link href={`/work-orders/${reference}`}>
              <a className="lbh-link">{reference}</a>
            </Link>
          </TD>
        )}
      <TD>
        {dateRaised ? dateToStr(dateRaised) : '—'}
        <div className="work-order-hours">
          {dateRaised ? extractTimeFromDate(dateRaised) : ''}
        </div>
      </TD>
      <TD>{tradeDescription}</TD>
      <TD>
        <span
          className={`status status-${status
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
        >
          {status}
        </span>
      </TD>
      <TD className="description">{description}</TD>
    </TR>
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

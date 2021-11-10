import PropTypes from 'prop-types'
import { dateToStr } from '@/utils/date'
import { extractTimeFromDate } from '@/utils/time'
import Link from 'next/link'
import { TR, TD } from '../Layout/Table'

const WorkOrderRow = ({
  reference,
  dateRaised,
  priority,
  property,
  status,
  tradeDescription,
  description,
}) => (
  <TR
    reference={reference}
    className="govuk-table__row--clickable lbh-body-s hackney-work-order-table"
  >
    <TD>
      <Link href={`/work-orders/${reference}`}>
        <a className="lbh-link">{reference}</a>
      </Link>
    </TD>
    <TD>
      {dateRaised ? dateToStr(dateRaised) : '—'}
      <div className="work-order-hours">
        {dateRaised ? extractTimeFromDate(dateRaised) : ''}
      </div>
    </TD>
    <TD>{priority}</TD>
    <TD>{property}</TD>
    <TD>{status}</TD>
    <TD>{tradeDescription}</TD>
    <TD className="description">{description}</TD>
  </TR>
)

WorkOrderRow.propTypes = {
  reference: PropTypes.number.isRequired,
  dateRaised: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tradeDescription: PropTypes.string.isRequired,
}

export default WorkOrderRow

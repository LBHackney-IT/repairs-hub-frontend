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
    <TD className="table-font-size">
      <Link href={`/work-orders/${reference}`}>
        <a className="lbh-link">{reference}</a>
      </Link>
    </TD>
    <TD className="table-font-size">
      {dateRaised ? dateToStr(dateRaised) : '—'}
      <div className="work-order-hours">
        {dateRaised ? extractTimeFromDate(dateRaised) : ''}
      </div>
    </TD>
    <TD className="table-font-size">{priority}</TD>
    <TD className="table-font-size">{property}</TD>
    <TD className="table-font-size">{status}</TD>
    <TD className="table-font-size">{tradeDescription}</TD>
    <TD className="description table-font-size">{description}</TD>
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

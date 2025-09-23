import PropTypes from 'prop-types'
import { dateToStr } from '@/utils/date'
import { extractTimeFromDate } from '@/utils/time'
import Link from 'next/link'
import { useState } from 'react'
import { TR, TD } from '../Layout/Table'
import TruncateText from '../Layout/TruncateText'
import Status from '../WorkOrder/Status'

const WorkOrderRow = ({
  reference,
  dateRaised,
  priority,
  property,
  status,
  tradeDescription,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <TR
      reference={reference}
      className="govuk-table__row--clickable lbh-body-s hackney-work-order-table"
    >
      <TD className="lbh-body-xs">
        <Link href={`/work-orders/${reference}`}>
          <a className="lbh-link">{reference}</a>
        </Link>
      </TD>
      <TD className="lbh-body-xs">
        {dateRaised ? dateToStr(dateRaised) : '—'}
        <div className="work-order-hours">
          {dateRaised ? extractTimeFromDate(dateRaised) : ''}
        </div>
      </TD>
      <TD className="lbh-body-xs">{priority}</TD>
      <TD className="lbh-body-xs">{property}</TD>
      <TD>
        <Status text={status} className="lbh-body-xs work-order-status" />
      </TD>
      <TD className="lbh-body-xs">{tradeDescription}</TD>
      <TD className="description lbh-body-xs">
        <TruncateText
          text={description}
          numberOfLines="5"
          linkClassName="description lbh-body-xs"
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        ></TruncateText>
      </TD>
    </TR>
  )
}

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

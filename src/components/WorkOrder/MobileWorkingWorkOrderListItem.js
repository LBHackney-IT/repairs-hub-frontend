import PropTypes from 'prop-types'
import Link from 'next/link'
import Status from './Status'
import cx from 'classnames'
import { WorkOrder } from '../../models/workOrder'

const MobileWorkingWorkOrderListItem = ({
  workOrder,
  index,
  statusText,
  currentUser,
}) => {
  return (
    <Link
      href={`/operatives/${currentUser.operativePayrollNumber}/work-orders/${workOrder.reference}`}
      style={{
        textDecoration: 'none !important',
      }}
    >
      <li
        data-id={index}
        style={{ cursor: 'pointer' }}
        className={cx(
          'govuk-!-margin-top-3',
          'operative-work-order-list-item',
          workOrder.hasBeenVisited()
            ? 'operative-work-order-list-item--inactive'
            : 'operative-work-order-list-item--active'
        )}
      >
        <div className="appointment-details">
          <div>
            <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-display-inline">
              {`${workOrder.appointment.start} – ${workOrder.appointment.end}`}
            </h3>

            {statusText && (
              <Status
                text={statusText}
                className="work-order-status govuk-!-margin-top-0 govuk-!-margin-left-2"
              />
            )}
          </div>
          <p
            className={cx(
              'lbh-body lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-margin-bottom-2 capitalize'
            )}
          >
            {workOrder.priority.toLowerCase()}
          </p>
          <h3 className="lbh-heading-h3 lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-display-inline">
            {`WO ${workOrder.reference}`}
          </h3>
          <p className="lbh-body govuk-!-margin-0">{workOrder.property}</p>
          <p className="lbh-body govuk-!-margin-0 govuk-!-margin-bottom-8">
            {workOrder.propertyPostCode}
          </p>
          <p className="lbh-body govuk-!-margin-0 truncate-description truncate-line-3">
            {workOrder.description}
          </p>
        </div>
        <div className="govuk-!-margin-0">
          <span className="arrow right"></span>
        </div>
      </li>
    </Link>
  )
}

MobileWorkingWorkOrderListItem.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  index: PropTypes.number.isRequired,
  currentUser: PropTypes.object.isRequired,
  statusText: PropTypes.string,
}

export default MobileWorkingWorkOrderListItem

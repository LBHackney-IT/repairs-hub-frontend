import PropTypes from 'prop-types'
import Link from 'next/link'
import Status from '../WorkOrder/Status'
import cx from 'classnames'
import { WorkOrder } from '../../models/workOrder'

const OperativeWorkOrderListItem = ({ workOrder, index, statusText }) => {
  return (
    <>
      <Link href={`/work-orders/${workOrder.reference}`}>
        <li
          data-id={index}
          className={cx(
            'appointment-info-box',
            workOrder.hasBeenVisited()
              ? 'appointment-info-box--inactive'
              : 'appointment-info-box--active'
          )}
        >
          <div className="appointment-details">
            <div>
              <h3 className="lbh-heading-h3 appointment-time lbh-!-font-weight-bold govuk-!-margin-0 govuk-!-display-inline ">
                {`${workOrder.appointment.start} – ${workOrder.appointment.end}`}
              </h3>

              {statusText && (
                <Status
                  text={statusText}
                  className="govuk-!-margin-top-0 govuk-!-margin-left-2 uppercase"
                />
              )}
            </div>
            <p
              className={cx(
                'lbh-body lbh-!-font-weight-bold govuk-!-margin-0 capitalize'
              )}
            >
              {workOrder.priority.toLowerCase().split(' ').slice(-1)}
            </p>
            <p className="lbh-body govuk-!-margin-0">{workOrder.property}</p>
            <p className="lbh-body govuk-!-margin-0">
              {workOrder.propertyPostCode}
            </p>
            <p className="lbh-body govuk-!-margin-0 truncate">
              {workOrder.description}
            </p>
          </div>
          <div className="govuk-!-margin-0">
            <span className="arrow right"></span>
          </div>
        </li>
      </Link>
    </>
  )
}

OperativeWorkOrderListItem.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
  index: PropTypes.number.isRequired,
  statusText: PropTypes.string,
}

export default OperativeWorkOrderListItem

import PropTypes from 'prop-types'
import { WorkOrder } from '@/models/workOrder'
import { formatDateTime } from '@/utils/time'

const WorkOrderInfo = ({ workOrder }) => {
  return (
    <div className="work-order-info">
      <div className="lbh-body-s govuk-!-margin-bottom-2">
        <span
          className={`circle-tag circle-tag--status-${workOrder.status
            .replace(/\s+/g, '-')
            .toLowerCase()}`}
        ></span>
        <span className="lbh-!-font-weight-bold">
          Status: {workOrder.status}
        </span>
        <br></br>
        {workOrder.isHigherPriority() ? (
          <span className="text-dark-red govuk-!-font-size-14">
            <strong>Priority: {workOrder.priority}</strong>
          </span>
        ) : (
          <span className="govuk-!-font-size-14">
            Priority: {workOrder.priority}
          </span>
        )}
      </div>

      <div className="lbh-body-xs govuk-!-margin-bottom-2">
        <span>Raised by {workOrder.raisedBy}</span>
        {workOrder.dateRaised && (
          <>
            <br></br>
            <span>{formatDateTime(workOrder.dateRaised)}</span>
          </>
        )}
      </div>

      {workOrder.target && (
        <div className="lbh-body-xs govuk-!-margin-bottom-2">
          <span className="lbh-!-font-weight-bold">
            Target: {formatDateTime(workOrder.target)}
          </span>
        </div>
      )}

      {workOrder.callerName && (
        <div className="lbh-body-xs govuk-!-margin-bottom-2">
          <span>Caller: {workOrder.callerName}</span>
          {workOrder.callerNumber && (
            <>
              <br></br>
              <span>{workOrder.callerNumber}</span>
            </>
          )}
        </div>
      )}

      {!!workOrder?.startTime && (
        <div className="lbh-body-xs govuk-!-margin-bottom-2">
          <span>Started at</span>
          <br></br>
          <span>{formatDateTime(workOrder.startTime)}</span>
        </div>
      )}
    </div>
  )
}

WorkOrderInfo.propTypes = {
  workOrder: PropTypes.instanceOf(WorkOrder).isRequired,
}

export default WorkOrderInfo

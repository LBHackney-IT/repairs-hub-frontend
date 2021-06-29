import PropTypes from 'prop-types'
import { IMMEDIATE_PRIORITY_CODE } from '../../utils/helpers/priorities'
import { formatDateTime } from '../../utils/time'

const WorkOrderInfo = ({ workOrder }) => {
  return (
    <div className="work-order-info">
      <span className="govuk-!-font-size-14">Work order</span>

      <div className="lbh-body-s govuk-!-margin-bottom-2">
        <span className="lbh-!-font-weight-bold">
          Status: {workOrder.status}
        </span>
        <br></br>
        {workOrder.priorityCode === IMMEDIATE_PRIORITY_CODE ? (
          <span className="text-dark-red govuk-!-font-size-14">
            Priority: {workOrder.priority}
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
    </div>
  )
}

WorkOrderInfo.propTypes = {
  workOrder: PropTypes.object.isRequired,
}

export default WorkOrderInfo

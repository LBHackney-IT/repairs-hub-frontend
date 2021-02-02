import PropTypes from 'prop-types'
import { formatDateTime } from '../../utils/time'

const WorkOrderInfo = ({ workOrder }) => {
  return (
    <div className="work-order-info">
      <span className="govuk-!-font-size-14">Works order</span>

      <div className="govuk-body-s govuk-!-margin-bottom-2">
        <span className="govuk-!-font-weight-bold">
          Status: {workOrder.status}
        </span>
        <br></br>
        {workOrder.priorityCode == 1 ? (
          <span className="text-danger govuk-!-font-size-14">
            Priority: {workOrder.priority}
          </span>
        ) : (
          <span className="govuk-!-font-size-14">
            Priority: {workOrder.priority}
          </span>
        )}
      </div>

      <div className="govuk-body-xs govuk-!-margin-bottom-2">
        <span>Raised by {workOrder.raisedBy}</span>
        {workOrder.dateRaised && (
          <>
            <br></br>
            <span>{formatDateTime(workOrder.dateRaised)}</span>
          </>
        )}
      </div>

      {workOrder.target && (
        <div className="govuk-body-xs govuk-!-margin-bottom-2">
          <span className="govuk-!-font-weight-bold">
            Target: {formatDateTime(workOrder.target)}
          </span>
        </div>
      )}

      {workOrder.callerName && (
        <div className="govuk-body-xs govuk-!-margin-bottom-2">
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

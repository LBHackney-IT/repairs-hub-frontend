import classNames from 'classnames'
import { format } from 'date-fns'
import Status from '../../WorkOrder/Status'
import { WorkOrderHierarchy } from './types'
import FollowOnFlag from '../../Flags/FollowOnFlag'

interface Props {
  hierarchy: WorkOrderHierarchy
}

const RelatedWorkOrderViewList = ({ hierarchy }: Props) => {
  if (hierarchy?.workOrders?.length === 1 && hierarchy?.workOrders[0].isSelf) {
    return <p className="lbh-body-s">No related work orders</p>
  }

  return (
    <ul className="lbh-body-m wo-hierarchy-list">
      {hierarchy?.workOrders?.map(({ workOrder, isSelf }) => (
        <li
          className={classNames('wo-hierarchy-list-row', {
            'wo-hierarchy-list-row--self': isSelf,
          })}
          key={workOrder.reference}
        >
          <div className="wo-hierarchy-row-left">
            <span className="wo-hierarchy-left-bar" />
            <span className="wo-hierarchy-left-circle" />
          </div>

          <div className="wo-hierarchy-row-right">
            <div className="wo-hierarchy-bottom-container">
              <div className="wo-hierarchy-date">
                {format(new Date(workOrder.dateRaised), 'd MMMM yyyy')}
              </div>

              <div
                style={{
                  marginTop: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                {workOrder?.isFollowOn && <FollowOnFlag />}

                <Status
                  text={workOrder.status}
                  className="work-order-status govuk-!-margin-0"
                />
              </div>
            </div>
            <div className="wo-hierarchy-link-and-trade">
              <span className="wo-hierarchy-link">
                <a href={`/work-orders/${workOrder.reference}`}>
                  {workOrder.reference}
                </a>
              </span>

              <div style={{ marginTop: 0 }}>{workOrder.tradeDescription}</div>
            </div>

            <p style={{ marginTop: 0 }}>{workOrder.description}</p>
            <hr className="wo-hierarchy-hr" />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default RelatedWorkOrderViewList

import classNames from 'classnames'
import { format } from 'date-fns'
import Status from '../../WorkOrder/Status'
import Link from 'next/link'
import { WorkOrderHierarchy } from './types'

interface Props {
  hierarchy: WorkOrderHierarchy
}

const RelatedWorkOrderViewList = ({ hierarchy }: Props) => {
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

              <div style={{ marginTop: 0 }}>
                <Status text={workOrder.status} className="work-order-status" />
              </div>
            </div>
            <div className="wo-hierarchy-link-and-trade">
              <span className="wo-hierarchy-link">
                <Link href={`/work-orders/${workOrder.reference}`}>
                  {workOrder.reference}
                </Link>
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

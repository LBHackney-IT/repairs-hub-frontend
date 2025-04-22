import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/root/src/models/workOrder'
import Link from 'next/link'
import { format } from 'date-fns'
import Status from '../../WorkOrder/Status'
import classNames from 'classnames'

interface WorkOrderHierarchy {
  rootParentId: string
  workOrders: {
    directParentId: string
    isRoot: boolean
    isSelf: boolean
    workOrder: WorkOrder
  }[]
}

interface Props {
  tabName: string
  workOrderReference: string
}

const RelatedWorkOrdersView = ({ workOrderReference, tabName }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hierarchy, setHierarchy] = useState<WorkOrderHierarchy | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchHierarchy = async () => {
    setIsLoading(true)

    setError(null)
    setHierarchy(null)

    try {
      const response: WorkOrderHierarchy = await frontEndApiRequest({
        path: `/api/workOrders/${workOrderReference}/hierarchy`,
        method: 'get',
      })

      setHierarchy(response)
    } catch (e) {
      setHierarchy(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchHierarchy()
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      {hierarchy && (
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
                    <Status
                      text={workOrder.status}
                      className="work-order-status"
                    />
                  </div>
                </div>
                <div className="wo-hierarchy-link-and-trade">
                  <span className="wo-hierarchy-link">
                    <Link href={`/work-orders/${workOrder.reference}`}>
                      {workOrder.reference}
                    </Link>
                  </span>

                  <div style={{ marginTop: 0 }}>
                    {workOrder.tradeDescription}
                  </div>
                </div>

                <p style={{ marginTop: 0 }}>{workOrder.description}</p>
                <hr className="wo-hierarchy-hr" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default RelatedWorkOrdersView

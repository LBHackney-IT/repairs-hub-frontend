import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/root/src/models/workOrder'
import Link from 'next/link'
import { format } from 'date-fns'
import Status from '../../WorkOrder/Status'

const WORK_ORDERS_HISTORY_PAGE_SIZE = 50

interface Props {
  tabName: string
  propertyReference: string
}

const RelatedWorkOrdersView = ({ propertyReference, tabName }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchWorkOrders = async (propertyReference: string) => {
    setIsLoading(true)

    setError(null)
    setWorkOrders([])

    try {
      const response = await frontEndApiRequest({
        path: '/api/workOrders/',
        method: 'get',
        params: {
          propertyReference: propertyReference,
          PageSize: WORK_ORDERS_HISTORY_PAGE_SIZE,
          PageNumber: 1,
          sort: 'dateraised:desc',
        },
      })

      setWorkOrders(response)
    } catch (e) {
      setWorkOrders(null)
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
    fetchWorkOrders(propertyReference)
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      {workOrders?.length > 0 && (
        <ul className="lbh-body-m wo-hierarchy-list">
          {workOrders?.map((x) => (
            <li className="wo-hierarchy-list-row" key={x.reference}>
              <div className="wo-hierarchy-row-left">
                <span className="wo-hierarchy-left-bar" />
                <span className="wo-hierarchy-left-circle" />
              </div>

              <div className="wo-hierarchy-row-right">
                <div className="wo-hierarchy-bottom-container">
                  <div className="wo-hierarchy-date">
                    {format(new Date(x.dateRaised), 'd MMMM yyyy')}
                  </div>

                  <div style={{ marginTop: 0 }}>
                    <Status text={x.status} className="work-order-status" />
                  </div>
                </div>k
                <div className="wo-hierarchy-link-and-trade">
                  <span className="wo-hierarchy-link">
                    <Link href={`/work-orders/${x.reference}`}>
                      {x.reference}
                    </Link>
                  </span>

                  <div style={{ marginTop: 0 }}>{x.tradeDescription}</div>
                </div>

                <p style={{ marginTop: 0 }}>{x.description}</p>
                <hr className="wo-hierarchy-hr" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* {workOrders?.length === 0 && !error && (
        <>
          <h2 className="lbh-heading-h2">{tabName}</h2>
          <div>
            <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />
            <h4 className="lbh-heading-h4">
              There are no historical repairs for this property.
            </h4>
          </div>
        </>
      )} */}

      {error && <ErrorMessage label={error} />}
    </>
  )
}

export default RelatedWorkOrdersView

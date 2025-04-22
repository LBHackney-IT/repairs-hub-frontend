import { useState, useEffect } from 'react'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { WorkOrder } from '@/root/src/models/workOrder'
import Link from 'next/link'
import { formatDateTime } from '@/root/src/utils/time'
import { format } from 'date-fns'
import Status from '../../WorkOrder/Status'

const WORK_ORDERS_HISTORY_PAGE_SIZE = 50

interface Props {
  tabName: string
  propertyReference: string
}

const RelatedWorkOrdersView = ({ propertyReference, tabName }: Props) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getWorkOrdersHistoryView = async (propertyReference, pageNumber) => {
    setError(null)
    setWorkOrders([])

    try {
      const data = await frontEndApiRequest({
        path: '/api/workOrders/',
        method: 'get',
        params: {
          propertyReference: propertyReference,
          PageSize: WORK_ORDERS_HISTORY_PAGE_SIZE,
          PageNumber: pageNumber,
          sort: 'dateraised:desc',
        },
      })

      setWorkOrders([...workOrders, ...data])
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
    setIsLoading(true)

    getWorkOrdersHistoryView(propertyReference, 1)
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <h2 className="lbh-heading-h2">{tabName}</h2>
      {workOrders?.length > 0 && (
        <ul
          className="lbh-body-m"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {workOrders?.map((x) => (
            <li
              style={{
                display: 'flex',
                flexDirection: 'row',
                minHeight: '50px',
                marginTop: '30px', // :not(:first-child)
              }}
              key={x.reference}
            >
              <div style={{ position: 'relative', marginRight: '30px' }}>
                <div
                  style={{
                    background: '#fff',
                    borderRadius: '100%',
                    border: '2px solid #777',
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    top: -4,
                    left: -11,
                    zIndex: 2,
                  }}
                ></div>
                <div
                  style={{
                    width: '2px',
                    background: '#777',
                    // marginRight: '30px',
                    height: 'calc(100% + 30px)',
                    position: 'absolute',
                    top: 6,
                    left: 0,
                    marginTop: 0,
                    zIndex: 1,
                  }}
                ></div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: 0,
                  flexGrow: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <div style={{ color: '#666', marginBottom: '15px' }}>
                    {format(new Date(x.dateRaised), 'd MMMM yyyy')}
                  </div>

                  <div style={{ marginTop: 0 }}>
                    <Status text={x.status} className="work-order-status" />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 0,
                    marginBottom: '15px',
                    display: 'flex',
                  }}
                >
                  <span
                    style={{
                      marginRight: '15px',
                      display: 'block',
                      fontWeight: 'normal',
                    }}
                  >
                    <Link href={`/work-orders/${x.reference}`}>
                      {x.reference}
                    </Link>
                  </span>

                  <div style={{ marginTop: 0 }}>{x.tradeDescription}</div>
                </div>

                <p style={{ marginTop: 0 }}>{x.description}</p>
                <hr
                  style={{ borderColor: 'transparent', background: '#eee' }}
                />
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

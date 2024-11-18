import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import Layout from '../Layout'
import { useEffect, useState } from 'react'
import SpinnerWithLabel from '../../SpinnerWithLabel'

interface WorkOrderResponse {
  reference: number
  dateRaised: string
  lastUpdated: Date | null
  priority: string
  priorityCode: number
  property: string
  propertyPostCode: string
  owner: string
  description: string
  propertyReference: string
  tradeCode: string
  tradeDescription: string
  status: string
}

const DrsSyncView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [workOrders, setWorkOrders] = useState<WorkOrderResponse[]>(null)

  const fetchWorkOrdersThatDidntSync = () => {
    if (isLoading) return
    setIsLoading(true)

    frontEndApiRequest({
      method: 'get',
      path: '/api/backoffice/work-orders-by-sync-status',
    })
      .then((res) => {
        console.log({ res })

        setWorkOrders(res)
      })
      .catch((err) => {
        console.error(err)
        //   setRequestError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleResendToDrs = (workOrderId: number) => {
    if (isLoading) return

    if (!confirm('Have you confirmed the order doesnt exist in DRS?')) return

    setIsLoading(true)

    frontEndApiRequest({
      method: 'post',
      path: '/api/backoffice/resend-order',
      requestData: {
        workOrderId,
      },
    })
      .then((res) => {
        console.log({ res })

        // setWorkOrders(res)
        //   setFormSuccess(true)
        //   clearForm()
      })
      .catch((err) => {
        console.error(err)
        //   setRequestError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleClearStatus = (workOrderId: number) => {
    if (isLoading) return

    if (!confirm('Are you sure?')) return

    setIsLoading(true)

    frontEndApiRequest({
      method: 'post',
      path: '/api/backoffice/reset-sync-status',
      requestData: {
        workOrderId,
      },
    })
      .then((res) => {
        console.log({ res })

        // setWorkOrders(res)
        //   setFormSuccess(true)
        //   clearForm()
      })
      .catch((err) => {
        console.error(err)
        //   setRequestError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchWorkOrdersThatDidntSync()
  }, [])

  const groupedByStatus: { [key: string]: number } = {}

  workOrders?.forEach((workOrder) => {
    if (groupedByStatus.hasOwnProperty(workOrder.status)) {
      groupedByStatus[workOrder.status]++
    } else {
      groupedByStatus[workOrder.status] = 1
    }
  })

  const [selectedFilter, setSelectedFilter] = useState<string>(null)

  const filteredWorkOrders =
    selectedFilter === null
      ? workOrders
      : workOrders.filter((x) => x.status === selectedFilter)

  if (isLoading) return <SpinnerWithLabel label="Fetching work orders" />

  return (
    <>
      <Layout title="Drs Sync Retry">
        <>
          <h2>Work orders that timed out</h2>

          <div>
            <button onClick={() => fetchWorkOrdersThatDidntSync()}>
              Refresh
            </button>
          </div>

          <div>
            <ul
              style={{
                display: 'flex',
                background: '#ddd',
                padding: '15px',
                flexDirection: 'row',
              }}
            >
              {Object.keys(groupedByStatus).map((key) => (
                <li style={{ display: 'block', margin: '0 0 0 15px' }}>
                  {key}: {groupedByStatus[key]}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label htmlFor="">Filter by status</label>
            <br />
            <select
              onChange={(e) => {
                if (e.target.value === 'All') {
                  setSelectedFilter(null)
                } else {
                  setSelectedFilter(e.target.value)
                }
              }}
            >
              <option value="All">All</option>
              {Object.keys(groupedByStatus).map((key) => (
                <option value={key}>{key}</option>
              ))}
            </select>
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredWorkOrders?.map((x) => {
              return (
                <li
                  key={x.reference}
                  style={{ display: 'block', background: '#eee' }}
                >
                  <p>
                    <a href={`/work-orders/${x.reference}`}>View work order</a>
                  </p>

                  <div>
                    <button onClick={() => handleResendToDrs(x.reference)}>
                      Resend to DRS
                    </button>
                    <button onClick={() => handleClearStatus(x.reference)}>
                      Reset status
                    </button>
                    <button disabled>WIP - Fetch reference from DRS (order found on DRS)</button>
                  </div>

                  <pre>{JSON.stringify(x, null, 2)}</pre>
                </li>
              )
            })}
          </ul>
        </>
      </Layout>
    </>
  )
}

export default DrsSyncView

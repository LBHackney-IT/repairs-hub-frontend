import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../Spinner'
import ErrorMessage from '../Errors/ErrorMessage'
import OperativeWorkOrderListItem from './OperativeWorkOrderListItem'
import WarningInfoBox from '../Template/WarningInfoBox'
import Meta from '../Meta'
import { WorkOrder } from '../../models/workOrder'

const OperativeWorkOrdersView = () => {
  const currentDate = beginningOfDay(new Date())
  const [inProgressWorkOrders, setInProgressWorkOrders] = useState([])
  const [visitedWorkOrders, setVisitedWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const getOperativeWorkOrderView = async () => {
    setLoading(true)
    setError(null)

    try {
      const currentUser = await frontEndApiRequest({
        method: 'get',
        path: '/api/hub-user',
      })

      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/workorders`,
      })

      const workOrders = data.map((wo) => new WorkOrder(wo))

      setInProgressWorkOrders(workOrders.filter((wo) => !wo.hasBeenVisited()))
      setVisitedWorkOrders(workOrders.filter((wo) => wo.hasBeenVisited()))
    } catch (e) {
      setInProgressWorkOrders(null)
      setVisitedWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    getOperativeWorkOrderView()
  }, [])

  const renderWorkOrderListItems = (workOrders) => {
    return workOrders.map((workOrder, index) => (
      <OperativeWorkOrderListItem
        key={index}
        workOrder={workOrder}
        index={index}
        statusText={(() => {
          const status = workOrder.status.toLowerCase()

          if (status === 'no access') {
            return 'Closed'
          } else if (status === 'work complete') {
            return 'Completed'
          } else {
            return ''
          }
        })()}
      />
    ))
  }

  return (
    <>
      <Meta title="Manage work orders" />
      <div className="mobile-working-title-banner">
        <h1 className="lbh-heading-h1">
          {longMonthWeekday(currentDate, { commaSeparated: false })}
        </h1>
      </div>

      <h3 className="lbh-heading-h3">Work orders</h3>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {inProgressWorkOrders?.length || visitedWorkOrders?.length ? (
            <>
              <ol className="lbh-list">
                {renderWorkOrderListItems(inProgressWorkOrders)}
                {renderWorkOrderListItems(visitedWorkOrders)}
              </ol>
            </>
          ) : (
            <WarningInfoBox
              header="No work orders displayed"
              text="Please contact your supervisor"
            />
          )}
          {error && <ErrorMessage label={error} />}
        </>
      )}
    </>
  )
}

export default OperativeWorkOrdersView

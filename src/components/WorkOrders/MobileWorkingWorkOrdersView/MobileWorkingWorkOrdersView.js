import { useState, useEffect, useRef } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'
import { MobileWorkingWorkOrderListItems } from './MobileWorkingWorkOrderListItems'

const SIXTY_SECONDS = 60 * 1000

const MobileWorkingWorkOrdersView = ({ currentUser }) => {
  const currentDate = beginningOfDay(new Date())
  const [visitedWorkOrders, setVisitedWorkOrders] = useState(null)
  const [sortedWorkOrders, setSortedWorkOrders] = useState(null)

  const [error, setError] = useState()

  const getOperativeWorkOrderView = async () => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/workorders`,
      })

      const workOrders = data.map((wo) => new WorkOrder(wo))
      const visitedWorkOrders = workOrders.filter((wo) => wo.hasBeenVisited())

      const sortedWorkOrderItems = sortWorkOrderItems(currentUser, workOrders)

      setVisitedWorkOrders(visitedWorkOrders)
      setSortedWorkOrders(sortedWorkOrderItems)
    } catch (e) {
      setVisitedWorkOrders(null)
      setSortedWorkOrders(null)

      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${
          e.response?.status
        } with message: ${JSON.stringify(e.response?.data?.message)}`
      )
    }
  }

  const intervalRef = useRef(null)

  useEffect(() => {
    // dont try fetch if currentUser not loaded yet
    if (currentUser === null) return

    // initial fetch (otherwise it wont fetch until interval)
    getOperativeWorkOrderView()

    const intervalId = setInterval(() => {
      getOperativeWorkOrderView()
    }, SIXTY_SECONDS)

    intervalRef.current = intervalId

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [currentUser?.operativePayrollNumber])

  const sortWorkOrderItems = (currentUser, workOrders) => {
    const inProgressWorkOrders = workOrders.filter((wo) => !wo.hasBeenVisited())

    const startedWorkOrders = workOrders.filter(
      (wo) => !wo.hasBeenVisited() && !!wo.appointment.startedAt?.length
    )

    // The operative is NOT an OJAAT operative
    if (!currentUser.isOneJobAtATime) return inProgressWorkOrders

    // If the operative has started a work order
    if (startedWorkOrders?.length) return startedWorkOrders

    // Return the next unstarted work order
    return inProgressWorkOrders
      .sort((a, b) => {
        return a.appointment.assignedStart.localeCompare(
          b.appointment.assignedStart
        )
      })
      .slice(0, 1)
  }

  return (
    <>
      <Meta title="Manage work orders" />
      <div className="mobile-working-title-banner">
        <h2 className="lbh-heading-h2">
          {longMonthWeekday(currentDate, { commaSeparated: false })}
        </h2>
      </div>

      <h3 className="lbh-heading-h3">Work orders</h3>
      {sortedWorkOrders === null ? (
        <Spinner />
      ) : (
        <>
          {sortedWorkOrders?.length || visitedWorkOrders?.length ? (
            <ol className="lbh-list mobile-working-work-order-list">
              <MobileWorkingWorkOrderListItems
                workOrders={[...sortedWorkOrders, ...visitedWorkOrders]}
                currentUser={currentUser}
              />
            </ol>
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

export default MobileWorkingWorkOrdersView

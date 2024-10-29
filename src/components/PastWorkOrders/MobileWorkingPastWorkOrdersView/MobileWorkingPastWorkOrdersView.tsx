import { useState, useEffect, useRef } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay, daysBeforeDateRangeExcWeekend } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'
import { MobileWorkingPastWorkOrderListItems } from './MobileWorkingPastWorkOrderListItems'

const SIXTY_SECONDS = 60 * 1000

const MobileWorkingPastWorkOrdersView = ({ currentUser }) => {
  const currentDate = beginningOfDay(new Date())
  const lastSevenDays = daysBeforeDateRangeExcWeekend(currentDate, 7)
  const [visitedWorkOrders, setVisitedWorkOrders] = useState(null)
  const [sortedWorkOrders, setSortedWorkOrders] = useState(null)
  const [error, setError] = useState<string | null>()
  console.log(lastSevenDays)
  const getOperativeWorkOrderView = async () => {
    setError(null)

    // try {
    //   const data = await frontEndApiRequest({
    //     method: 'get',
    //     path: `/api/operatives/017233/workorders`,
    //   })

    //   const workOrders = data.map((wo) => new WorkOrder(wo))

    //   const visitedWorkOrders = workOrders.filter((wo) => wo.hasBeenVisited())

    //   const sortedWorkOrderItems = sortWorkOrderItems(currentUser, workOrders)
    //   setVisitedWorkOrders(visitedWorkOrders)
    //   setSortedWorkOrders(sortedWorkOrderItems)
    // } catch (e) {
    //   setVisitedWorkOrders(null)
    //   setSortedWorkOrders(null)

    //   console.error('An error has occured:', e)
    //   setError(
    //     `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
    //   )
    // }
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
        <h3>Past Orders</h3>
      </div>

      <h3 className="lbh-heading-h3">Select date</h3>
      <div className="lbh-heading-h2">
        <select name="date-picker" id="date-picker">
          {lastSevenDays.map((day, index) => {
            return (
              <option value={day.toString()} key={index}>
                {day.toString().slice(3, 10)}
              </option>
            )
          })}
        </select>
      </div>
      {/* {sortedWorkOrders === null ? (
        <Spinner />
      ) : (
        <>
          {sortedWorkOrders?.length || visitedWorkOrders?.length ? (
            <ol className="lbh-list mobile-working-work-order-list">
              <MobileWorkingPastWorkOrderListItems
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
      )} */}
    </>
  )
}

export default MobileWorkingPastWorkOrdersView

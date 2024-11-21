import { useState, useEffect, useRef } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { getYesterdayDate } from '@/root/src/utils/date'
import { beginningOfDay, getWorkingDaysBeforeDate } from '@/root/src/utils/time'

import PastWorkOrdersDatePicker from '../../PastWorkOrdersDatePicker/Index'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import WarningInfoBox from '../../Template/WarningInfoBox'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'
import { MobileWorkingPastWorkOrderListItems } from './MobileWorkingPastWorkOrderListItems'
import {
  CurrentUser,
  WorkOrderType,
  WorkOrdersType,
} from '@/root/src/types/variations/types'

const SIXTY_SECONDS = 60 * 1000

const MobileWorkingPastWorkOrdersView = ({ currentUser }) => {
  const currentDate = beginningOfDay(new Date())
  const yesterday = new Date(getYesterdayDate(currentDate))
  const [visitedWorkOrders, setVisitedWorkOrders] = useState(null)
  const [sortedWorkOrders, setSortedWorkOrders] = useState(null)
  const [error, setError] = useState<string | null>()
  const [selectedDate, setSelectedDate] = useState<Date>(yesterday)
  const targetDate = selectedDate.toISOString().split('T')[0]

  const lastFiveWorkingDays = getWorkingDaysBeforeDate(currentDate, 7)

  const getOperativeWorkOrderView = async () => {
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/016062/workOrdersNew?date=${targetDate}`,
      })

      const workOrders: WorkOrdersType = data.map(
        (wo: WorkOrderType) => new WorkOrder(wo)
      )

      const visitedWorkOrders = workOrders.filter((wo: WorkOrderType) =>
        wo.hasBeenVisited()
      )

      const sortedWorkOrderItems = sortWorkOrderItems(currentUser, workOrders)
      setVisitedWorkOrders(visitedWorkOrders)
      setSortedWorkOrders(sortedWorkOrderItems)
    } catch (e) {
      setVisitedWorkOrders(null)
      setSortedWorkOrders(null)
      console.error('An error has occured:', e)
      setError(
        `Request failed with status code: ${e.response?.status} with message: ${e.response?.data?.message}`
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
  }, [currentUser?.operativePayrollNumber, targetDate])

  const sortWorkOrderItems = (
    currentUser: CurrentUser,
    workOrders: WorkOrdersType
  ) => {
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

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = event.target.value
    setSelectedDate(new Date(selectedDate))
  }
  return (
    <>
      <Meta title="Manage past work orders" />
      <div className="mobile-work-order-container">
        <PastWorkOrdersDatePicker
          handleChange={handleDateChange}
          lastFiveWorkingDays={lastFiveWorkingDays}
        />
        {sortedWorkOrders === null && !error ? (
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
            ) : !error ? (
              <WarningInfoBox
                header="No work orders displayed"
                text="Please contact your supervisor"
                name="No jobs warning"
              />
            ) : (
              <ErrorMessage label={error} />
            )}
          </>
        )}
      </div>
    </>
  )
}

export default MobileWorkingPastWorkOrdersView

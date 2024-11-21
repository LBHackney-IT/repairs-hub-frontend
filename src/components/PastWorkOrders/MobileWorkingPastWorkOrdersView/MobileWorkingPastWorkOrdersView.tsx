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
  WorkOrderType,
  WorkOrdersType,
} from '@/root/src/types/variations/types'

const MobileWorkingPastWorkOrdersView = ({ currentUser }) => {
  const currentDate = beginningOfDay(new Date())
  const yesterday = new Date(getYesterdayDate(currentDate))

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
        path: `/api/operatives/${currentUser.operativePayrollNumber}/workOrdersNew?date=${targetDate}`,
      })

      const workOrders: WorkOrdersType = data.map(
        (wo: WorkOrderType) => new WorkOrder(wo)
      )

      const sortedWorkOrderItems = sortWorkOrderItems(workOrders)

      setSortedWorkOrders(sortedWorkOrderItems)
    } catch (e) {
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

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [currentUser?.operativePayrollNumber, targetDate])

  const sortWorkOrderItems = (workOrders: WorkOrdersType) => {
    return workOrders.sort((a, b) => {
      return a.appointment.assignedStart.localeCompare(
        b.appointment.assignedStart
      )
    })
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
            {sortedWorkOrders?.length ? (
              <ol className="lbh-list mobile-working-work-order-list">
                <MobileWorkingPastWorkOrderListItems
                  workOrders={[...sortedWorkOrders]}
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

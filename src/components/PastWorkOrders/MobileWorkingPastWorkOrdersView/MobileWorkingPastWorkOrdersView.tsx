import { useState, useEffect, useMemo } from 'react'
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

  const isSunday = selectedDate.getDay() === 0
  const targetDate = useMemo(() => {
    const date = isSunday
      ? yesterday.setDate(selectedDate.getDate() - 2)
      : selectedDate
    const targetDate = new Date(date).toISOString().split('T')[0]
    return targetDate
  }, [selectedDate])

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const lastFiveWorkingDays = getWorkingDaysBeforeDate(currentDate, 7)

  const getOperativeWorkOrderView = async () => {
    setError(null)
    setIsLoading(true)
    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/appointments?date=${targetDate}`,
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
    setIsLoading(false)
  }

  useEffect(() => {
    // dont try fetch if currentUser not loaded yet
    if (currentUser === null) return

    getOperativeWorkOrderView()
  }, [currentUser?.operativePayrollNumber, targetDate])

  const sortWorkOrderItems = (workOrders: WorkOrdersType) => {
    return workOrders.sort((a, b) => {
      return a.appointment.assignedStart.localeCompare(
        b.appointment.assignedStart
      )
    })
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
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
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <ErrorMessage label={error} />
        ) : sortedWorkOrders?.length ? (
          <ol className="lbh-list mobile-working-work-order-list">
            <MobileWorkingPastWorkOrderListItems
              workOrders={sortedWorkOrders}
              currentUser={currentUser}
            />
          </ol>
        ) : (
          <WarningInfoBox
            header="No work orders displayed"
            name="No jobs warning"
          />
        )}
      </div>
    </>
  )
}

export default MobileWorkingPastWorkOrdersView

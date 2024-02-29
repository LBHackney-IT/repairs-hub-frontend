import { useState, useEffect, useRef,  } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem'
import WarningInfoBox from '../../Template/WarningInfoBox'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'

const SIXTY_SECONDS = 60 * 1000

const MobileWorkingWorkOrdersView = ({
  currentUser,
  loggingEnabled = true,
}) => {
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

      const inProgressWorkOrders = workOrders.filter(
        (wo) => !wo.hasBeenVisited()
      )

      const visitedWorkOrders = workOrders.filter((wo) => wo.hasBeenVisited())

      const startedWorkOrders = workOrders.filter(
        (wo) => !wo.hasBeenVisited() && !!wo.appointment.startedAt?.length
      )

      const sortedWorkOrderItems = sortWorkOrderItems(
        currentUser,
        inProgressWorkOrders,
        startedWorkOrders
      )

      setVisitedWorkOrders(visitedWorkOrders)
      setSortedWorkOrders(sortedWorkOrderItems)

      const inProgressWorkOrderIds = inProgressWorkOrders.map(
        (x) => x.reference
      )
      const startedWorkOrderIds = startedWorkOrders.map((x) => x.reference)
      const currentWorkOrderId = currentUser.isOneJobAtATime
        ? sortedWorkOrderItems
        : null

      if (loggingEnabled) {
        logWorkOrders(
          currentUser.operativePayrollNumber,
          currentUser.isOneJobAtATime,
          inProgressWorkOrderIds,
          startedWorkOrderIds,
          currentWorkOrderId
        )
      }
    } catch (e) {
      setVisitedWorkOrders(null)
      setSortedWorkOrders(null)

      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
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
  }, [currentUser.operativePayrollNumber])

  const renderWorkOrderListItems = (workOrders) => {
    if (workOrders.length === 0) {
      return <></>
    }

    return workOrders.map((workOrder, index) => (
      <MobileWorkingWorkOrderListItem
        key={index}
        workOrder={workOrder}
        index={index}
        statusText={(() => {
          const status = workOrder.status.toLowerCase()

          if (status === 'no access') {
            return 'No access'
          } else if (status === 'completed') {
            return 'Completed'
          } else {
            return ''
          }
        })()}
        currentUser={currentUser}
      />
    ))
  }

  const sortWorkOrderItems = (
    currentUser,
    inProgressWorkOrders,
    startedWorkOrders
  ) => {
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

  const logWorkOrders = async (
    operativeId,
    ojaatEnabled,
    inProgressWorkOrderIds,
    startedWorkOrderIds,
    currentWorkOrderId
  ) => {
    const body = {
      operativeId,
      ojaatEnabled,
      inProgressWorkOrderIds,
      startedWorkOrderIds,
      currentWorkOrderId,
    }

    try {
      await frontEndApiRequest({
        method: 'post',
        path: '/api/frontend-logging/operative-mobile-view-work-orders',
        requestData: body,
      })
    } catch (error) {
      // fail silently - user doesnt need to know if logging fails
    }
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
      {setSortedWorkOrders === null ? (
        <Spinner />
      ) : (
        <>
          {sortedWorkOrders?.length || visitedWorkOrders?.length ? (
            <>
              <ol className="lbh-list mobile-working-work-order-list">
                {renderWorkOrderListItems(sortedWorkOrders)}
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

export default MobileWorkingWorkOrdersView

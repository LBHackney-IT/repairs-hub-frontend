import { useState, useEffect } from 'react'
import { frontEndApiRequest } from '@/utils/frontEndApiClient/requests'
import { beginningOfDay } from '@/utils/time'
import { longMonthWeekday } from '@/utils/date'
import Spinner from '../../Spinner'
import ErrorMessage from '../../Errors/ErrorMessage'
import MobileWorkingWorkOrderListItem from '../../WorkOrder/MobileWorkingWorkOrderListItem'
import WarningInfoBox from '../../Template/WarningInfoBox'
import Meta from '../../Meta'
import { WorkOrder } from '../../../models/workOrder'

const MobileWorkingWorkOrdersView = ({ currentUser }) => {
  const currentDate = beginningOfDay(new Date())
  const [inProgressWorkOrders, setInProgressWorkOrders] = useState([])
  const [visitedWorkOrders, setVisitedWorkOrders] = useState([])
  const [startedWorkOrders, setStartedWorkOrders] = useState([])
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const [sortedWorkOrders, setSortedWorkOrders] = useState([])

  const getOperativeWorkOrderView = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await frontEndApiRequest({
        method: 'get',
        path: `/api/operatives/${currentUser.operativePayrollNumber}/workorders`,
      })

      const workOrders = data.map((wo) => new WorkOrder(wo))

      setInProgressWorkOrders(workOrders.filter((wo) => !wo.hasBeenVisited()))
      setVisitedWorkOrders(workOrders.filter((wo) => wo.hasBeenVisited()))
      setStartedWorkOrders(
        workOrders.filter(
          (wo) => !wo.hasBeenVisited() && !!wo.appointment.startedAt?.length
        )
      )

      // const sortedWorkOrders = 

      const sortedWorkOrderItems = sortWorkOrderItems(
        currentUser,
        inProgressWorkOrders,
        startedWorkOrders
      )
      setSortedWorkOrders(sortedWorkOrderItems)

console.log({ inProgressWorkOrders})

    const inProgressWorkOrderIds = inProgressWorkOrders.map(x => x.reference)
    const startedWorkOrderIds = startedWorkOrders.map(x => x.reference)
    const currentWorkOrderId = currentUser.isOneJobAtATime ? sortedWorkOrderItems : null

    logWorkOrders(currentUser.operativePayrollNumber, currentUser.isOneJobAtATime, inProgressWorkOrderIds, startedWorkOrderIds, currentWorkOrderId)

    } catch (e) {
      setInProgressWorkOrders(null)
      setVisitedWorkOrders(null)
      setStartedWorkOrders(null)
      console.error('An error has occured:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }

    setLoading(false)
  }

  useEffect(() => {
    getOperativeWorkOrderView()
  }, [currentUser])

  const renderWorkOrderListItems = (workOrders) => {
    return (
      workOrders.length &&
      workOrders.map((workOrder, index) => (
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
    )
  }


  // useEffect(() => {
  //   console.log("yeet")
  // }, [sortedWorkOrders])

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



  const logWorkOrders = (operativeId, ojaatEnabled, inProgressWorkOrderIds, startedWorkOrderIds, currentWorkOrderId) => {

    console.log("SUBMIT LOG")


    const body = {
      operativeId, ojaatEnabled, inProgressWorkOrderIds, startedWorkOrderIds, currentWorkOrderId
    }

    console.log({ body})

    // frontEndApiRequest({
    //   method: 'post',
    //   path: '/api/frontend-logging/operative-mobile-view-work-orders',
    //   requestData: body,
    // })
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
      {loading ? (
        <Spinner />
      ) : (
        <>
          {inProgressWorkOrders?.length || visitedWorkOrders?.length ? (
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
